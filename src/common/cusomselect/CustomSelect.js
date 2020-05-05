import React, { Component } from "react";
import './CustomSelect.css'

class CustomSelect extends Component {
    render(){
        return(
            <select id={this.props.selectId} className="CustomSelect" onChange={this.props.onChangeCallback}>
                <option key="none">none</option>
                {this.props.data.map((item)=>{
                    return(
                    <option key={item}>{item}</option>
                    )
                })}
            </select>
        )
    }
}

export default CustomSelect;