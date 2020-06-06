import React, { Component } from 'react'
import './FileUpload.css'
import Dropzone from '../../common/dropzone/Dropzone'
import CircularProgressBar from '../../common/circularprogress/CircularProgressBar'

class FileUpload extends Component {
    constructor(props){
        super(props);
        this.state = {
            files: [],
            filepath:null, 
            uploading:false,
            uploadProgress: {},
            successfullUploaded:false,
        }

        this.baseState = this.state;

        this.renderZone = this.renderZone.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.reset = this.reset.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    reset(){
        this.setState(this.baseState);
    }

    onFilesAdded(files){
        files ?
          this.setState(() => ({
              files: [files],
              action: ""
          })) : 
          this.setState(() => ({
            files: [],
            action: ""
        }))
    }

    async uploadFile() {
            var file = this.state.files[0]
            this.setState({ uploadProgress: {}, uploading: true });
    
                var p = new Promise((resolve, reject) => {
                const req = new XMLHttpRequest();
                req.responseType = 'json';
                req.upload.addEventListener("progress", event => {
                if (event.lengthComputable) {
                    const copy = { ...this.state.uploadProgress };
                    copy[file.name] = {
                    state: "pending",
                    percentage: Math.round((event.loaded / event.total) * 100)
                };
                this.setState({ uploadProgress: copy });
                }
            });
          
            req.upload.addEventListener("load", event => {
            const copy = { ...this.state.uploadProgress };
            copy[file.name] = { state: "done", percentage: 100 };
            this.setState({ uploadProgress: copy });
                //resolve(req.response);
            });
          
            req.upload.addEventListener("error", event => {
                const copy = { ...this.state.uploadProgress };
                copy[file.name] = { state: "error", percentage: 0 };
                this.setState({ uploadProgress: copy });
                reject(req.response);
            });
    
            req.onreadystatechange = function () {
            if  (req.readyState === 4 ) {
                req.response ? resolve(req.response) : reject(req.response)
                }
            }
       
            const formData = new FormData();
            formData.append("file", file, file.name);
       
            req.open("POST", "http://localhost:9000/api/upload");
            req.send(formData);
        });
        p.then(
            function(res){
            this.setState({ successfullUploaded: true, uploading: false, filepath: res.value});
                //TO DO: norm handler here
            }.bind(this), function(reason){
                this.setState({ successfullUploaded: false, uploading: false, filepath: null });
            }.bind(this))
    }

    renderProgress(file){
        const uploadProgress = this.state.uploadProgress[file.name];
        return (
            <div className="ProgressContainer">
            <CircularProgressBar
                strokeWidth="2"
                sqSize="200"
                status={uploadProgress ? uploadProgress.state : "ready" }
                percentage={uploadProgress ? uploadProgress.percentage : 0}/>
            </div>
        ); 
    }

    renderZone(){
        return(
            <div>
            <div className="UploadFileContainer">
                <div className="UploadFileDropzoneContainer">
                    <Dropzone
                        onFilesAdded={this.onFilesAdded}
                        disabled={this.state.uploading || this.state.successfullUploaded}/>
                </div>
                <div className="UploadFileStatus">
                    {this.state.files.length > 0 
                        ? <div className="UploadFileZone">
                            {this.renderProgress(this.state.files[0])}</div> 
                        : <div className="UpdateEmptyRow">
                                <p>Drop some shit here!</p>
                                <img
                                alt="drop some shit here"
                                className="DropIcon"
                                src="left-arrow-sketch.svg"
                                />
                            </div>
                    }
                </div>
            </div>
            {this.state.files.length>0 && <div className="UpdateFileNameContainer">
                <p>Selected file:{this.state.files[0].name}</p>
            </div>}
            </div>
        )
    }

    renderButtons(){
        return(
            <div className="FileUploadButtonContainer">
                {this.state.successfullUploaded ? 
                    <button className="BlackButton" onClick={e => this.props.onNextStep(e, this.state.filepath)}>Next</button>:
                    <button className="BlackButton" disabled={ this.state.files.length <= 0 || this.state.uploading } onClick={this.uploadFile}>Upload</button>}
                <button className="ResetBtn BlackButton" onClick={e=>{this.props.onReset(); this.reset()}}>Cancel</button>
            </div>
        )
    }

    render(){
        return(
            <div>
                {this.renderZone()}
                {this.renderButtons()}
            </div>
        )
    }
}

export default FileUpload;