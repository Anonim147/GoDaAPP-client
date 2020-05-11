import React, { Component } from 'react'
import './CustomCheckbox.css'

class CustomCheckbox extends Component{
    render(){
        return(
            <div>
            <input 
                className="CustomCheckbox"
                type="checkbox" 
                value={this.props.itemkey} 
                name={this.props.name}
                onChange={this.props.onCheckboxChange}
            />
            <label htmlFor="checkbox">{this.props.name}</label>
            </div>
        )
    }
}

export default CustomCheckbox;