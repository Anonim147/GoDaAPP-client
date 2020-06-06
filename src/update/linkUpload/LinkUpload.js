import React, { Component } from 'react'
import './LinkUpload.css'
import { Spinner } from 'react-bootstrap'

class LinkUpload extends Component{
    constructor(props){
        super(props);

        this.state = {
            filepath:null,
            link:"",
            downloading: false,
            done: false,
            sucessfullDownload:false, 
            err: null
        }
        this.baseState = this.state;

        this.reset = this.reset.bind(this);
        this.onLinkInput = this.onLinkInput.bind(this);
        this.downloadFromLink = this.downloadFromLink.bind(this);
    }

    reset(){
        this.setState(this.baseState);
    }

    async downloadFromLink(){  
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "filelink": this.state.link })
        };

        const url = `http://localhost:9000/api/download_from_link`
        await fetch(url, requestOptions)
            .then(async response => {
                if (!response.ok) {
                    const error = response.text || response.status;
                    return Promise.reject(error);
                }
                const respData = await response.json();
                if(respData.success){
                    this.setState({downloading:false, done:true, sucessfullDownload:true, filepath:respData.value});
                }
                else{
                    this.setState({downloading:false, done:true, sucessfullDownload:true, filepath:null, err:respData.value})
                }
            })
            .catch(error => {
                this.setState({downloading:false, done:true, sucessfullDownload:true, selectData:null,err:error.toString()})
        });
    }

    onLinkInput(e){
        const re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
        if(e.target.value === "")
        {  this.setState({link:"",err:null}) }
        else if(e.target.value.match(re)) {
            this.setState({link:e.target.value,err:null})
        }
        else{this.setState({link:"",err:"Not valid url. Try again"})}
    }

    renderResult(){
        return(
            <div className="LinkDownloadResultContainer">
                    {this.state.downloading && <Spinner animation="border"/>}
                    {this.state.done &&<div>
                        { this.state.done && this.state.sucessfullDownload 
                                    ? <img
                                    alt="Success"
                                    className="DownloadResultIcon"
                                    src="done.svg"
                                /> : <img
                                    alt="Error"
                                    className="DownloadResultIcon"
                                    src="error.svg"
                                    />
                            }
                    </div>} 
            </div>
        )
    }

    render(){
        return(<div className="UpdateLinkUploadContainer">
            <div className="InnerElements">
            <input type="text" placeholder="type a link for download here"  onChange={this.onLinkInput}></input>
            <div className="LinkUploadButtonsContainer">
                {this.filepath 
                    ? <button className="BlackButton" onClick={e=> this.props.onNextStep(e, this.state.filepath)}>Next</button> 
                    : <button className="BlackButton" disabled={this.state.link==="" || this.state.downloading} onClick={this.downloadFromLink}>Download from Link</button>}
                <button className="BlackButton" onClick={this.props.onReset}>Cancel</button>
            </div>
                {this.state.err && <p id="LinkUploadError">{this.state.err}</p>}
                {this.renderResult()}
            </div>
        </div>)
    }
}

export default LinkUpload;