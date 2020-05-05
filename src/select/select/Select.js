import React, {Component} from 'react';
import './Select.css'
import CustomSelect from '../../common/cusomselect/CustomSelect'
import  { Spinner } from 'react-bootstrap';

class Select extends Component {
    constructor(props){
        super(props);
        this.state = {
            existedTables: null
        };

        this.renderTableNames = this.renderTableNames.bind(this)
    }

    async getableNames() {
        await fetch('http://localhost:9000/api/get_table_list').then(
          async response => {        
            if (!response.ok){
                const error = response.text || response.status
                return Promise.reject(error);
            }
            const data = await response.json();
            if (data && data.tables){ 
              this.setState({existedTables:data.tables});
            }
          }
        ).catch(error => {
            this.setState({existedTables:[]});
            console.log(`Error getting tablenames: ${error.message}`)
        });
      }

    renderHeader(){
        return(
            <div className="Header">
                <p>Select table:</p>
                {this.renderTableNames()}
                <button className="ColumnButton">Get columns!</button>
            </div>
        )
    }

    renderTableNames() {
        if (!this.state.existedTables){
          this.getableNames();
        }
    
        return(
          <div className="Header">
          { !this.state.existedTables ? 
            <Spinner animation="border" />
            : <CustomSelect selectId="TargetTable"
                data={this.state.existedTables} 
                onChangeCallback={this.getTableName} />
          }
          </div>
        )
      }

    render(){
        return(
            <div>
                {this.renderHeader()}
            </div>
        );
    }
}

export default Select;

