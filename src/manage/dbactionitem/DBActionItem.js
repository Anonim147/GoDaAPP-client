import React, { Component } from 'react';
import './DBActionItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faInfo, faEraser} from '@fortawesome/free-solid-svg-icons'

class DBActionItem extends Component{
    constructor(props){
        super(props);

        this.state = {
            err:null
        }
        this.clearTable = this.clearTable.bind(this);
    }

    async clearTable(evt, tablename){
        const requestOptions = {
            method: 'DELETE'
        }
        await fetch(`http://localhost:9000/api/clear_table/${tablename}`, requestOptions).then(
            async response => {        
                if (!response.ok){
                    const error = response.text || response.status;
                    return Promise.reject(error);
                }
                const data = await response.json();
                if (data && data.value){ 
                    this.setState({err: null});
                    this.props.onInfo(null, tablename)
                }
            }
        ).catch(error => {
            console.log(error);
            this.setState({err:error.toString()});
        });
    }

    render(){
        return(
            <div key={`${this.props.name}-container`} className="DBcationItemContainer">
                <p key={`${this.props.name}-name`}>{this.props.name}</p>
                <button className="BlackButton DBActionItemButton"
                        key={`${this.props.name}-drop`} 
                        onClick={e=>this.props.onDrop(e, this.props.name)}
                    ><FontAwesomeIcon 
                        icon={faTimes} 
                        size="sm"
                    />
                </button>
                <button className="BlackButton DBActionItemButton"
                        key={`${this.props.name}-clear`} 
                        onClick={e=>this.clearTable(e, this.props.name)}
                    ><FontAwesomeIcon 
                        icon={faEraser} 
                        size="sm"
                    />
                </button>
                <button className="BlackButton DBActionItemButton" 
                        key={`${this.props.name}-info`} 
                        onClick={e=>this.props.onInfo(e, this.props.name)}
                    ><FontAwesomeIcon 
                        icon={faInfo} 
                        size="sm"
                    />
                </button>
            </div>
        )
    }
}

export default DBActionItem;