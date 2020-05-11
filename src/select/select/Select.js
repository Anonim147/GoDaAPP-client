import React, {Component} from 'react';
import './Select.css'
import CustomSelect from '../../common/cusomselect/CustomSelect'
import CustomCheckbox from '../../common/customcheckbox/CustomCheckbox'
import  { Spinner } from 'react-bootstrap';
import ActiveFlterItem from '../activeFilterItem/ActiveFlterItem';
import FilterListItem from '../filterListItem/FilterListItem';

class Select extends Component {
    constructor(props){
        super(props);
        this.state = {
          existedTables: null,
          targetTable: null,
          tableKeys:null,
          err: null,
          colErr: null,
          columns: [],
          filters: [],
          curFilter:0,
          addDisabled: false
        };

        this.getTables = this.getTables.bind(this);
        this.getTableKeys = this.getTableKeys.bind(this);
        this.getInputValue = this.getInputValue.bind(this);
        this.updateTables = this.updateTables.bind(this);
        this.addOrRemoveColumn = this.addOrRemoveColumn.bind(this);
        this.getFilterItem = this.getFilterItem.bind(this);
        this.toogleFilter = this.toogleFilter.bind(this);
        this.deleteFilter = this.deleteFilter.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderTableNames = this.renderTableNames.bind(this);
        this.renderColumnNames=this.renderColumnNames.bind(this);
        this.renderSelectionMenu = this.renderSelectionMenu.bind(this);
        this.renderActiveFilter = this.renderActiveFilter.bind(this);
        this.renderExistedFilters = this.renderExistedFilters.bind(this);
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
            this.setState({existedTables:data.tables});
          }
        }
      ).catch(error => {
          console.log(error)
          this.setState({existedTables:[]});
          console.log(`Error getting tablenames: ${error.message}`)
      });
    }

    async getTableKeys(){
      if (!this.state.targetTable){
        this.setState({err:"Please, select table"});
      }
      else {
        await fetch(`http://localhost:9000/api/get_columns/${this.state.targetTable}`).then(
          async response => {
            if (!response.ok){
              const error = response.text || response.status;
              return Promise.reject(error);
            }
            console.log(response);
            const data = await response.json();
            console.log(data);
            if(data && data.value) {
              this.setState({tableKeys:data.value});
            }
          }
        ).catch(error => {
            console.log(error);
            this.setState({tableKeys:null, colErr:error.message})
        });
      }
    }

    getInputValue(evt) {
      if (evt.target.value!=="none"){
        this.setState({targetTable:evt.target.value, err:null})
      }
      else {
        this.setState({targetTable:null})
      }
    }

    updateTables(){
      this.setState({existedTables:null});
      this.getTables();
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

    getFilterItem(filterItem, context){
      filterItem.filtername=`Filter-${context.state.curFilter}`;
      context.setState({filters:context.state.filters.concat(filterItem), curFilter:context.state.curFilter+1 });
    }

    toogleFilter(value){
      this.setState({addDisabled:value});
    }
    
    deleteFilter(evt, filtername){
      evt.preventDefault();
      var filters = this.state.filters.filter((item)=>{return item.filtername!==filtername});
      this.setState({filters:filters});
    }

    renderHeader(){
        return(
            <div className="Header">
              <p>Select table:</p>
              <div>
                {this.renderTableNames()}
              <div>
                <button className="ColumnButton" disabled={!this.state.existedTables} onClick={this.getTableKeys}>Get columns!</button>
                <button className="ColumnButton" disabled={!this.state.existedTables} onClick={this.updateTables}>Reload Tables!</button>
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

    renderColumnNames(){
      return(
        <div className="KeysContainer">
          { this.state.tableKeys 
            ? this.state.tableKeys.map((item, index) => {
              return(
              <div key={index} className="ColumnContainer"> 
                <CustomCheckbox
                  key={item.keyname}
                  name={`${item.keyname}(${item.keytype})`}
                  onCheckboxChange={this.addOrRemoveColumn}
                />
                <div>
                  {this.renderExistedFilters(item.keyname)}
                  {this.renderActiveFilter(item)}
                </div>
              </div>)}) 
            : this.renderErr(this.state.err)
          }
        </div>
      )
    }

    renderSelectionMenu(){
      return(
        <div>
          {this.renderColumnNames()}
        </div>
      )
    }

    renderExistedFilters(name){
      var filters = this.state.filters.filter((item)=>{return item.columnpath===name})
      return(
        <div>
          {filters.map(item=>{
            return(
              <FilterListItem 
                key={item.filtername}
                item={item}
                onDeleteItem={this.deleteFilter}
              />
            )
          })}
        </div>
      )
    }

    renderActiveFilter(item){
      return(
        <ActiveFlterItem
          key={`${item.keyname}-select`}
          name={item.keyname}
          addDisabled={this.state.addDisabled}
          keytype={item.keytype}
          toogleFilter={this.toogleFilter}
          getFilterItem={this.getFilterItem}
          context={this}
        />
      );
    }
    
    renderErr(err){
    return(<p className="Error">{err}</p>)
    }

    render(){
        return(
            <div>
                {this.renderHeader()}
                { this.state.err ? this.renderErr(this.state.err) : this.renderSelectionMenu()}
            </div>
        );
    }
}

export default Select;

