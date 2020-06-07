import React, { Component } from 'react'
import './Manage.css'
import DBActionItem from '../dbactionitem/DBActionItem'

import { Spinner } from 'react-bootstrap'
import DBInfoItem from '../dbinfoitem/DBInfoItem'

class Manage extends Component{
    constructor(props){
        super(props)

        this.state = {
            existedTables:[],
            dbInfo:null,
            err: null
        }

        this.baseState = this.state;

        this.resetAll = this.resetAll.bind(this);
        this.onInfoClick = this.onInfoClick.bind(this);
        this.onDropClick = this.onDropClick.bind(this);
    }

    resetAll(){
        this.setState(this.baseState)
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

    async onInfoClick(evt, tablename) {
        await fetch(`http://localhost:9000/api/get_table_info/${tablename}`).then(
          async response => {
            if (!response.ok){
              const error = response.text || response.status;
              return Promise.reject(error);
            }
            const data = await response.json();
            if(data && data.value) {
              this.setState({dbInfo:data.value});
            }
          }
        ).catch(error => {
            this.setState({dbInfo:null, err:error.toString()})
        });
    }

    async onDropClick(evt, tablename){
        const requestOptions = {
            method:'DELETE'
        }
        await fetch(`http://localhost:9000/api/drop_table/${tablename}`, requestOptions).then(
          async response => {
            if (!response.ok){
              const error = response.text || response.status;
              return Promise.reject(error);
            }
            const data = await response.json();
            if(data && data.value) {
              await this.getTables()
            }
          }
        ).catch(error => {
            this.setState({err:error.toString()})
        });
    }

    renderDBItems(){
        if (this.state.existedTables.length<1 && !this.state.err){
            this.getTables();
        }
        return(
            <div className="ManageDBItemsContainer">
                {this.state.existedTables.length<1 
                ? <Spinner animation="border" />
                : this.state.existedTables.map((item)=>{
                        return(
                            <DBActionItem key={item} name={item} onDrop={this.onDropClick} onInfo={this.onInfoClick}/>
                        )
                    })
                }
            </div>
        )
    }

    renderDBInfo(){
        return(
            <div className="ManageDBInfoContainer">
                <DBInfoItem dbItem={this.state.dbInfo} onInfo={this.onInfoClick}/>
            </div>
        )
    }

    render(){
        return(
        <div>
            <div className="ManageContentContainer">
                {this.renderDBItems()}
                {this.renderDBInfo()}
            </div>
            <div className="ManageReset">
                <button className="BlackButton"  onClick={this.resetAll}>Reload</button>
            </div>
            <p id="ManageErr">{this.state.err}</p>
        </div>
        )
    }
}

export default Manage;