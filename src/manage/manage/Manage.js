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
            dbInfo:null
        }

        this.baseState = this.state;

        this.resetAll = this.resetAll.bind(this);
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

    onDropClick(evt, tableName){
        console.log(tableName);
    }

    renderDBItems(){
        if (this.state.existedTables.length<1){
            this.getTables();
        }
        return(
            <div className="ManageDBItemsContainer">
                {this.state.existedTables.length<1 
                ? <Spinner animation="border" />
                : this.state.existedTables.map((item)=>{
                        return(
                            <DBActionItem key={item} name={item} onDrop={this.onDropClick} onInfo={this.onDropClick}/>
                        )
                    })
                }
            </div>
        )
    }

    renderDBInfo(){
        return(
            <div className="ManageDBInfoContainer">
                <DBInfoItem dbItem={this.state.dbInfo}/>
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
        </div>
        )
    }
}

export default Manage;