import React, { Component } from 'react'
import './DBInfoItem.css'

class DBInfoItem extends Component{
    render(){
        return(
            <div className="DBInfoContainer">
                <img className="DBInfoIcon"
                    src="database.png"
                    alt="dbinfo"
                ></img>
                <div className="DBInfoText">
                    {this.props.dbItem 
                        ? Object.entries(this.props.dbItem).map((key, value)=>{
                        return(<p key={key[0]}>{key[0]}: {key[1]}</p>)
                        })
                        : <p>Select table for details:</p> 
                    }
                </div>
            </div>
        )
    }
}

export default DBInfoItem