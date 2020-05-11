import React, { Component } from "react";
import './FilterListItem.css'
import {faMinus} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class FilterListItem extends Component{
    render(){
        var filter = `${this.props.item.logicaltype} ${this.props.item.comparisontype} ${this.props.item.value}`
        return(
            <div className="FilterListItem">
            <a href='/' onClick={e=>this.props.onDeleteItem(e, this.props.item.filtername)}>
            <FontAwesomeIcon icon={faMinus} size="sm"/></a>
            <p>{filter}</p>
            </div>
        )
    }
}

export default FilterListItem;