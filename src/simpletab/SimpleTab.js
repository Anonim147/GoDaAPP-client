import React, {Component} from 'react'
import './SimpleTab.css'

class SimpleTab extends Component{
    sendRequest(){
        
    }
    render(){
        return(
            <div className="simpletab">
                <button onClick={this.sendRequest()}>Click me</button>
            </div>
        )
    }
}