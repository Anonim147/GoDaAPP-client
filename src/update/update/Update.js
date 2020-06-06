import React, { Component } from 'react'
import './Update.css'
import FileUpload from '../fileUpload/FileUpload';
import LinkUpload from '../linkUpload/LinkUpload';
import FieldSelect from '../fieldSelect/FieldSelect';
import {Spinner} from 'react-bootstrap'

class Update extends Component{
    constructor(props){
        super(props);
        this.state = {
            tabView:0,
            pageView:0,
            filepath: null,
            columns:[],
            updateMethod:null,
            updating:true,
            success:false,
            err:null
        };

        this.TabView={
            FILE: 0,
            LINK: 1
        }

        this.PageView={
            SOURCE:0,
            FIELDS:1,
            UPDATE:2
        }

        this.baseState = this.state;
        this.resetAll = this.resetAll.bind(this);
        this.changeView=this.changeView.bind(this);
        this.changeMainView = this.changeMainView.bind(this);
        this.setNextStep = this.setNextStep.bind(this);
        this.setAdditionalParams = this.setAdditionalParams.bind(this)
    }

    resetAll(){
        this.setState(this.baseState);
    }

    changeView(view){
        this.setState({tabView:view});
    }

    changeMainView(view){
        this.setState({pageView:view});
    }

    setAdditionalParams(targetTable, columns, method){
        this.updateTable(this.state.filepath, targetTable, columns, method)
        this.setState({
            targetTable:targetTable, columns:columns, updateMethod:method, pageView:this.PageView.UPDATE});
        
    }

    setNextStep(evt, filepath){
        if(filepath){
            this.setState({filepath:filepath, pageView:this.PageView.FIELDS});
        }
    }
    
    async updateTable(filepath, tablename, columns, updateMethod){
        const requestObj = {
            filepath:filepath,
            tablename:tablename,
            columns:columns,
            method:updateMethod
        } 
        console.log("sas")
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestObj)
        };

        const url = `http://localhost:9000/api/update_table`
        await fetch(url, requestOptions)
            .then(async response => {
                if (!response.ok) {
                    const error = response.text || response.status;
                    return Promise.reject(error);
                }
                const respData = await response.json();
                if(respData.success){
                    this.setState({updating:false, success:true});
                }
                else{
                    this.setState({updating:false, success:false, err:respData.value})
                }
            })
            .catch(error => {
                this.setState({updating:false, success:false, err:"Oooops!Something goes wrong..."})
        });
    }

    renderMainContainer(){
        return(
            <div>
             <div>
                {this.state.pageView === this.PageView.SOURCE && 
                    this.renderUploadContainer()}
                {this.state.pageView === this.PageView.FIELDS && 
                    <FieldSelect 
                        onNextStep={this.setAdditionalParams}
                        onReset={this.resetAll}
                    />}
                {this.state.pageView === this.PageView.UPDATE &&
                    this.renderResult()}
            </div>
         </div>
        )
    }

    renderUploadContainer(){
        return(
            <div className="UpdateContainer">
                <p>Select source for update:</p>
                <div className="UpdateTabsContainer">
                    <button 
                        className={this.state.tabView===this.TabView.FILE ? "UpdateTabActive" : "BlackButton"}
                        onClick={()=>this.changeView(this.TabView.FILE)}>
                        File
                    </button>
                    <button 
                        className={this.state.tabView===this.TabView.LINK ? "UpdateTabActive" : "BlackButton"}
                        onClick={()=>this.changeView(this.TabView.LINK)}>
                        Link
                    </button>
                </div>
                <div className="UpdateContentContainer">
                    {this.state.tabView === this.TabView.FILE && <FileUpload onNextStep={this.setNextStep} onReset={this.resetAll}/>}
                    {this.state.tabView === this.TabView.LINK && <LinkUpload onNextStep={this.setNextStep} onReset={this.resetAll}/>}
                </div>
            </div>
        )
    }

    renderResult(){
        return(
        <div className="ProcessUpdateWrapper">
        <div className="ProcessUpdateContent">
            {this.state.updating 
                ? <Spinner animation="border" /> 
                : this.state.success
                ? <img
                    alt="Success"
                    className="DownloadResultIcon"
                    src="done.svg"
                    /> 
                : <img
                    alt="Error"
                    className="DownloadResultIcon"
                    src="error.svg"
                    />}
                </div>
            {this.state.err && <p>{this.state.err}</p>}
            <button className="BlackButton" onClick={this.resetAll}>Reset</button>
            </div>
        )
    }

    render(){
        return(
            <div className="UpdateWrapper">
                {this.renderMainContainer()}
            </div>
        );
    }
}

export default Update;