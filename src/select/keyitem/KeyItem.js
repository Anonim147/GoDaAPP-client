import React, { Component } from 'react'
import './KeyItem.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus} from '@fortawesome/free-solid-svg-icons'
import CustomCheckbox from '../../common/customcheckbox/CustomCheckbox'
import CustomSelect from '../../common/cusomselect/CustomSelect'

class KeyItem extends Component{
    constructor(props){
        super(props);

        this.stringFilter = ['equal', 'like'];
        this.numberFilter = ['equal', 'like', '>', '>=', '<', '<='];
        this.arrayFilter = ['like'];
    }

    renderFilter(){
        var selectData;
        switch(this.props.keytype){
            case "number":
                selectData = this.numberFilter;
            break;
            case "array":
                selectData = this.arrayFilter;
            break;
            default:
                selectData = this.stringFilter;
            break;
        }
        return(
            <div>
                <CustomSelect key={this.props.keyname+"-select"} data={selectData} onChangeCallback={this.props.onfilteChange} />
                <input key={this.props.keyname+"input"} type="text" onChange={this.props.onValueChange}/>
                <button>{this.props.logicalType}</button>
            </div>
        )
    }

    render(){
        return(
            <div>
                <CustomCheckbox
                itemkey={this.props.keyname}
                name={`${this.props.keyname}(${this.props.keytype})`}
                handler={this.props.onCheckbox}
                />
                {
                    !this.props.activeFilter ?
                    <div>
                        <a href="/" onClick={this.props.onToogleFilter}><FontAwesomeIcon icon={faPlus} size="sm"/></a>
                    </div>  :
                    <div>
                        <a href="/" onClick={this.onToogleFilter}><FontAwesomeIcon icon={faMinus} size="sm"/></a>
                        {this.renderFilter()}
                    </div>
                }  
            </div>
        )
    }
}

export default KeyItem;