import React, { Component } from 'react'
import './ActiveFilterItem.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faCheck} from '@fortawesome/free-solid-svg-icons'
import CustomSelect from '../../common/cusomselect/CustomSelect'

class KeyItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            activeFilter:false,
            conditionType:null,
            conditionValue:null,
            logicalType:"OR",
            err: null
        };

        this.baseState = this.state;
        this.enableFilter = this.enableFilter.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.updateCondition = this.updateCondition.bind(this);
        this.toogleLogicalType = this.toogleLogicalType.bind(this);
        this.getFilterItem = this.getFilterItem.bind(this);
        this.disableFilter = this.disableFilter.bind(this);
    }

    enableFilter(evt){
        evt.preventDefault();      
        if(!this.props.addDisabled){
            this.setState({activeFilter:true});
            this.props.toogleFilter(true);
        }
    }

    disableFilter(evt){
        evt.preventDefault();
        this.setState(this.baseState);
        this.props.toogleFilter(false);

    }

    updateValue(evt){
        var value = evt.target.value;
        if(this.props.keytype==="number"){
            var re = /^[+-]?\d+(\.\d+)?$/
            if(re.test(value)){ //todo: regex test
                this.setState({conditionValue:value});
            }
            else{
                this.setState({conditionValue:null});
            }
        }
        else{
            this.setState({conditionValue:value});
        }
    }

    updateCondition(evt){
        var value = evt.target.value;
        if(value!=='none'){
            this.setState({conditionType:value});
        }
        else
        {
            this.setState({conditionType:null});
        }
    }

    toogleLogicalType(){
        if(this.state.logicalType==="OR"){
            this.setState({logicalType:"AND"})
        }
        else{
            this.setState({logicalType:"OR"});
        }
    }

    getFilterItem(){
        var cT = this.state.conditionType;
        var cV = this.state.conditionValue;
        var lT = this.state.logicalType;
        if(cT && cV && lT){
            var filterItem = {
                columnpath:this.props.name,
                logicaltype:lT,
                comparisontype:cT,
                value:cV
            }
        this.props.getFilterItem(filterItem, this.props.context);
        this.props.toogleFilter(false);
        this.setState(this.baseState);
        }
        else{
            this.setState({err:"Values is not valid. Try again!"});
        }
    }

    renderFilter(){
        var selectData;
        switch(this.props.keytype){
            case "number":
                selectData = ['=', '>', '>=', '<', '<=', '!='];
            break;
            case "array":
                selectData = [];
            break;
            case "object":
                selectData = ['have']
                break;
            default:
                selectData = ['=', 'like'];
            break;
        }
        return(
            <div className="ActiveFilterItem">
                <div className="ActiveFilterElements">
                <CustomSelect key={`${this.props.name}-select`} data={selectData} onChangeCallback={this.updateCondition}/> 
                <input type="text" onChange={this.updateValue} />
                <button onClick={this.toogleLogicalType}>{this.state.logicalType}</button>
                <button onClick={this.getFilterItem}><FontAwesomeIcon icon={faCheck} size="sm"/></button>
                </div>
                <p>{this.state.err}</p>
            </div>
        )
    }

    render(){
        return(
            <div className="ActiveFilterContainer">
                { this.state.activeFilter && 
                    <div className="ActiveFilter">
                        <a href="/" onClick={this.disableFilter}><FontAwesomeIcon icon={faMinus} size="sm"/></a>
                        {this.renderFilter()}
                    </div>}
                    <div>
                        <a href="/" onClick={this.enableFilter}><FontAwesomeIcon icon={faPlus} size="sm"/></a>
                    </div> 
                  
            </div>
        )
    }
}

export default KeyItem;