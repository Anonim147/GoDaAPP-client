import React, {Component} from 'react';
import './Select.css'
import CustomSelect from '../../common/cusomselect/CustomSelect'
import CustomCheckbox from '../../common/customcheckbox/CustomCheckbox'
import  { Spinner } from 'react-bootstrap';
import ActiveFlterItem from '../activeFilterItem/ActiveFlterItem';
import FilterListItem from '../filterListItem/FilterListItem';
import CustomTable from '../customtable/CustomTable';

class Select extends Component {
    constructor(props){
        super(props);

        this.viewstatus = {
          EMPTY : 0,
          LOADING : 1,
          KEYSVIEW : 2,
          TABLEVIEW : 3,
          ERROR : 4
        }

        this.state = {
          existedTables: null,
          targetTable: null,
          tableKeys:null,
          err: null,
          columns: [],
          filters: [],
          curFilter:0,
          addDisabled: false,
          selectData: null,
          viewStatus: this.viewstatus.EMPTY
        };

        this.baseState = this.state;

        this.getNextData = this.getNextData.bind(this);
        this.getPrevData = this.getPrevData.bind(this);
        this.getTables = this.getTables.bind(this);
        this.getTableKeys = this.getTableKeys.bind(this);
        this.getSelectData = this.getSelectData.bind(this);
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
        this.renderSelect = this.renderSelect.bind(this);
        this.resetAll = this.resetAll.bind(this);
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
            this.setState({existedTables:data.tables, err: null, viewStatus: this.viewstatus.EMPTY});
          }
        }
      ).catch(error => {
          this.setState({existedTables:[], err:error.toString(), viewStatus: this.viewstatus.ERROR});
      });
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
              this.setState({tableKeys:data.value, viewStatus: this.viewstatus.KEYSVIEW});
            }
          }
        ).catch(error => {
            this.setState({tableKeys:null, err:error.toString(), viewStatus: this.viewstatus.ERROR})
        });
      }
    }

    async getNextData(evt){
      if (this.state.selectData){
        this.getSelectData(evt, this.state.selectData.pagination.next_link)
      }
    }

    async getPrevData(evt)
    {
      if (this.state.selectData){
        this.getSelectData(evt, this.state.selectData.pagination.prev_link)
      }
    }

    async getSelectData(evt, url){
      if(this.state.columns.length >0 ){
      this.setState({viewStatus:this.viewstatus.LOADING});
      if (!url){
        url='http://localhost:9000/api/get_data&limit=10&offset=0'
      }
      var requestObj = {
        tablename: this.state.targetTable,
        columns: this.state.columns,
        conditions: this.state.filters.map(item=>{return {
                        columnpath:item.columnpath, 
                        logicaltype:item.logicaltype, 
                        comparisontype:item.comparisontype, 
                        value:item.value
                      }})
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestObj)
      };

      await fetch(url, requestOptions)
          .then(async response => {
              if (!response.ok) {
                  const error = response.text || response.status;
                  return Promise.reject(error);
              }
              const respData = await response.json();
              this.setState({selectData:respData, viewStatus:this.viewstatus.TABLEVIEW});
          })
          .catch(error => {
              this.setState({selectData:null,err:error.toString(), viewStatus:this.viewstatus.ERROR})
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
            <div className="SelectSectionHeader">
              <p>Select table:</p>
              <div>
                {this.renderTableNames()}
              <div>
                <button className="ColumnButton" disabled={!this.state.existedTables} onClick={this.getTableKeys}>Get columns!</button>
                <button className="ColumnButton" disabled={!this.state.existedTables} onClick={this.resetAll}>Reset</button>
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
           <div>
              {this.state.tableKeys.map((item, index) => {
              return(
              <div key={index} className="ColumnContainer"> 
                { item.keytype === "number" || item.keytype === "string" || item.keytype === "array" ?
                  <CustomCheckbox
                  key={item.keyname}
                  itemkey={item.keyname}
                  name={item.keyname}
                  onCheckboxChange={this.addOrRemoveColumn}
                />
                :<div className="ContainerWithoutCheckbox"><p>{item.keyname}</p></div>}
                <div>
                  {this.renderExistedFilters(item.keyname)}
                  {this.renderActiveFilter(item)}
                </div>
              </div>)})}
              <button className="GetSelectDataButton" onClick={this.getSelectData} disabled={!this.state.columns || this.state.columns.length<1}>Get Data</button>
            </div> 
        </div>
      )
    }

    renderSelectionMenu(){
      return( 
        <div className="SelectSectionContent">
          {this.state.viewStatus === this.viewstatus.LOADING && <div className="SelectLoading"><Spinner animation="border"/></div>}
          {this.state.viewStatus === this.viewstatus.KEYSVIEW && <div>{this.renderColumnNames()}</div>}
          {this.state.viewStatus === this.viewstatus.TABLEVIEW && <div>{this.renderSelect()}</div>}
          {this.state.viewStatus === this.viewstatus.ERROR && <div>{this.renderErr()}</div>}
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
    
    renderErr(){
      return(<p className="SelectSectionError">{this.state.err}</p>)
    }

    renderSelect(){
      return(
        <CustomTable
          headers={this.state.columns}
          data={this.state.selectData.data}
          pagination={this.state.selectData.pagination} 
          getPrevData={this.getPrevData}
          getNextData={this.getNextData}
        />
      )
    }

    render(){
        return(
            <div>
                {this.renderHeader()}
                {this.renderSelectionMenu()}
            </div>
        );
    }
}

export default Select;

