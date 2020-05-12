import React, { Component } from 'react'
import './CustomTable.css'
import { Table } from 'react-bootstrap'

class CustomTable extends Component{
    constructor(props){
        super(props);

        this.renderTable = this.renderTable.bind(this);
        this.renderNavs = this.renderNavs.bind(this);
    }

    renderTable(){
        return(
            <Table responsive bordered hover size="sm">
                <thead>
                    <tr>
                        {this.props.headers.map(item=>{
                            return <th key={item}>{item}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {this.props.data.map((item, index)=>{
                        return(
                        <tr key={`tr${index}`}>
                            {this.props.headers.map((innerItem, innerIndex)=>{
                                return(<th key={`${index}${innerIndex}`}>{item[innerItem]}</th>)
                            })}
                        </tr>)
                    })}
                </tbody>
            </Table>
        )
    }

    renderNavs(){
        return(
            <div className="CustomTableNavButtonsContainer">
                <button disabled={this.props.pagination.prev_link===""} onClick={this.props.GetPrevData}>Prev</button>
                <button disabled={this.props.pagination.next_link===""} onClick={this.props.GetNextData}>Next</button>
            </div>
        )
    }

    render(){
        return(
            <div className="CustomTableContainer">
                {this.renderTable()}
                {this.renderNavs()}
            </div>
        )
    }
}

export default CustomTable;