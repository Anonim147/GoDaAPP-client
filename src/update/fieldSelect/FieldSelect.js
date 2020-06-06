import React, { Component } from 'react'
import './FieldSelect.css'
import { Spinner } from 'react-bootstrap'
import CustomSelect from '../../common/cusomselect/CustomSelect'
import CustomCheckbox from '../../common/customcheckbox/CustomCheckbox'

class FieldSelect extends Component{
    constructor(props){
        super(props)

        this.viewstatus = {
            EMPTY : 0,
            LOADING : 1,
            KEYSVIEW : 2,
            TABLEVIEW : 3,
            ERROR : 4
        }

        this.state = {
            existedTables:null,
            targetTable:null,
            err: null,
            viewStatus:this.viewstatus.EMPTY,
            tableKeys:[],
            method: null,
            columns:[]
        }

        this.baseState = this.state;

        this.reset = this.reset.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.getTableKeys = this.getTableKeys.bind(this);
        this.getInputValue = this.getInputValue.bind(this);
        this.getUpdateMethod = this.getUpdateMethod.bind(this);
        this.addOrRemoveColumn = this.addOrRemoveColumn.bind(this);
    };


    reset(){
        this.setState(this.baseState);
    }

    getInputValue(evt) {
        if (evt.target.value!=="none"){
          this.setState({targetTable:evt.target.value, err:null})
        }
        else {
          this.setState({targetTable:null})
        }
    }

    async getTableKeys(){
        if (!this.state.targetTable){
          this.setState({err:"Please, select table"});
        }
        else {
          this.setState({filters:[], viewStatus: this.viewstatus.LOADING, columns:[], addDisabled:false});
          await fetch(`http://localhost:9000/api/get_columns/${this.state.targetTable}`).then(
            async response => {
              if (!response.ok){
                const error = response.text || response.status;
                return Promise.reject(error);
              }
              const data = await response.json();
              if(data && data.value) {
                this.setState({tableKeys:this.filterKeys(data.value), viewStatus: this.viewstatus.KEYSVIEW});
              }
            }
          ).catch(error => {
              this.setState({tableKeys:[], err:error.toString(), viewStatus: this.viewstatus.ERROR})
          });
        }
      }

    filterKeys(keys){
      var re = /\.\[\]\./
      return keys.filter(item=>{return !re.test(item)})
    }
    
    renderOptions(){
        return(
            <div className="UpdateOptionsContainer">
                <p>Select update method</p>
                <CustomSelect
                    data={["full replace", "only changed"]}
                    onChangeCallback={this.getUpdateMethod}
                />
            </div>
        )
    }

    renderTableSelect(){
        if (!this.state.existedTables){
          this.getTables();
        }
        return(
          <div className="SelectContainer">
          { !this.state.existedTables ? 
            <Spinner animation="border" />
            : <CustomSelect selectId="TargetTableSelect"
                data={this.state.existedTables} 
                onChangeCallback={this.getInputValue} />
          }
          </div>
        )
    }

    renderSelectionMenu(){
        return( 
          <div className="SelectSectionContent">
            {this.state.viewStatus === this.viewstatus.LOADING && <div className="SelectLoading"><Spinner animation="border"/></div>}
            {this.state.viewStatus === this.viewstatus.KEYSVIEW && <div>{this.renderColumns()}</div>}
            {this.state.viewStatus === this.viewstatus.ERROR && <div>{this.renderErr()}</div>}
          </div>
        )
    }

    renderColumns(){
        return(
            <div className="FieldSelectKeys">
                {
                this.state.tableKeys.map((item)=>{
                return(
                    <CustomCheckbox
                        key={item.keyname}
                        itemkey={item.keyname}
                        name={item.keyname}
                        onCheckboxChange={this.addOrRemoveColumn}
                    />)
                    })
                }
            </div>
        )
    }

    async getTables(){
        await fetch('http://localhost:9000/api/get_table_list').then(
            async response => {        
                if (!response.ok){
                    const error = response.text || response.status;
                    return Promise.reject(error);
                }
                const data = await response.json();
                if (data && data.tables){ 
                    this.setState({existedTables:data.tables, err: null});
                }
            }
        ).catch(error => {
            this.setState({existedTables:[], err:error.toString()});
        });
    }

    addOrRemoveColumn(evt){
      var allcolumns = this.state.columns;
      if (evt.target.checked){
        allcolumns.push(evt.target.value);
      }
      if (!evt.target.checked){
        allcolumns = allcolumns.filter((item) => {return item !== evt.target.value}); 
      }
      this.setState({columns:allcolumns});
    }

    getUpdateMethod(evt){
      if (evt.target.value!=="none"){
          this.setState({method:evt.target.value, err:null})
        }
        else {
          this.setState({method:null})
        }
    } 

    renderHeader(){
        return(
            <div className="SelectSectionHeader">
              <p>Select table:</p>
              <div>
                {this.renderTableNames()}
              <div>
                <button className="ColumnButton" disabled={!this.state.existedTables} onClick={this.getTableKeys}>Get columns!</button>
                <button className="ColumnButton" disabled={!this.state.existedTables} onClick={this.reset}>Reset</button>
              </div>
              </div>
            </div>
        )
    }

    renderTableNames(){
        if (!this.state.existedTables){
          this.getTables();
        }
        return(
          <div className="SelectContainer">
          { !this.state.existedTables ? 
            <Spinner animation="border" />
            : <CustomSelect selectId="TargetTableSelect"
                data={this.state.existedTables} 
                onChangeCallback={this.getInputValue} />
          }
          </div>
        )  
    }

    renderButtons(){
        return(<div className="FieldSelectButtons">
                <button className="BlackButton" 
                  onClick={e=> this.props.onNextStep(this.state.targetTable, this.state.columns, this.state.method)}
                  disabled={ !this.state.method || this.state.columns.length<1}
                  >Next</button>
                <button className="BlackButton" onClick={this.reset}>Reset</button>
            </div>)
    }

    render(){
        return(
            <div className="FieldSelectContent">
                {this.renderOptions()}
                {this.renderHeader()}
                {this.renderSelectionMenu()}
                {this.renderButtons()}
            </div>
        )
    }
}

export default FieldSelect;