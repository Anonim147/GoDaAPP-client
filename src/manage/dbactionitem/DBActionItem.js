import React, { Component } from 'react';
import './DBActionItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faInfo, faEraser} from '@fortawesome/free-solid-svg-icons'

class DBActionItem extends Component{

    async clearTable(){
        console.log("clearing")
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
                        onClick={this.clearTable}
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