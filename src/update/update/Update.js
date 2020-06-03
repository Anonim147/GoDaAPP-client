import React, { Component } from 'react'
import  { Spinner } from 'react-bootstrap';
import './Update.css'
import CustomSelect from '../../common/cusomselect/CustomSelect'
import FileUpload from '../fileUpload/FileUpload';


class Update extends Component{
    constructor(props){
        super(props);
        this.state = {
            tabView:0,
            targetTable: null,
            existedTables: null, 
            filepath: null
        };

        this.TabView={
            FILE: 0,
            LINK: 1
        }

        this.baseState = this.state;

        this.renderTableSelect = this.renderTableSelect.bind(this);
        this.resetAll = this.resetAll.bind(this);
        this.changeView=this.changeView.bind(this);
        this.setPath = this.setPath.bind(this)
    }

    resetAll(){
        this.setState(this.baseState);
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

    changeView(view){
        this.setState({tabView:view});
    }

    setPath(evt, filepath){
        this.setState({filepath:filepath});
    }

    renderOptions(){
        return(
            <div className="UpdateOptionsContainer">
                <p>Select update method</p>
                <CustomSelect
                    data={["full replace", "only changed"]}
                    onChangeCallback={this.GetUpdateMethod}
                />
            </div>
        )
    }

    renderLinkUpdate(){
        return(<div>Link</div>)
    }

    renderAutoUpdate(){
        return(<div>Auto</div>)
    }

    renderHeader(){
        return(
            <div className="SelectSectionHeader">
              <p>Select table:</p>
              <div>
                {this.renderTableSelect()}
              <div>
                <button className="UpdateHeaderButton BlackButton" 
                    disabled={!this.state.existedTables} 
                    onClick={this.resetAll}>Reload
                </button>
              </div>
              </div>
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

    renderUpdateContainer(){
        return(
            <div className="UpdateContainer">
                <div className="UpdateTabsContainer">
                    <button 
                        className={this.state.tabView===this.TabView.FILE ? "UpdateTabActive" : "BlackButton"}
                        onClick={()=>this.changeView(this.TabView.FILE)}>
                        File
                    </button>
                    <button 
                        className={this.state.tabView===this.TabView.LINK ? "UpdateTabActive" : "BlackButton"}
                        onClick={()=>this.changeView(this.TabView.LINK)}>
                        Link
                    </button>
                </div>
                <div className="UpdateContentContainer">
                    {this.state.tabView === this.TabView.FILE ? <FileUpload onNextStep={this.setPath}/> : ""}
                    {this.state.tabView === this.TabView.LINK ? this.renderLinkUpdate() : ""}
                </div>
            </div>
        )
    }

    render(){
        return(
            <div className="UpdateWrapper">
                {this.renderHeader()}
                {this.renderOptions()}
                {this.renderUpdateContainer()}
            </div>
        );
    }
}

export default Update;