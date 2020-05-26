import React, { Component } from 'react'
import './Upload.css'
import Dropzone from '../dropzone/Dropzone'
import CircularProgressBar from '../circularprogress/CircularProgressBar'
import  { Spinner } from 'react-bootstrap';

class Upload extends Component {
  constructor(props) {
      super(props);
      this.state = {
        files: [],
        uploading: false,
        importing: false,
        uploadProgress: {},
        successfullUploaded: false,
        successfullImport: false,
        tableName: null,
        importStatus: "Working with table.Please, wait.",
        existedTables: null,
        downloadLink: null,
        filepath: null,
        textErr:null,
        importFinished: false
      };
      this.baseState = this.state;
  
      this.onFilesAdded = this.onFilesAdded.bind(this);
      this.uploadFile = this.uploadFile.bind(this);
      this.renderActions = this.renderActions.bind(this);
      this.cancelImport = this.cancelImport.bind(this);
      this.getInputValue = this.getInputValue.bind(this);
      this.startImportTable = this.startImportTable.bind(this);
      this.renderLoader = this.renderLoader.bind(this);
  }

  cancelImport() {
    this.setState(this.baseState)
  }

  startImportTable() {
    if(this.state.filepath && this.state.tableName) {
      let url;
      let data = JSON.stringify(
        {
          tablename:this.state.tableName,
          filepath: this.state.filepath
        });
        url = "http://localhost:9000/api/insert_data"
      this.insertTable(url, data)
    }
    else if  (!this.state.tableName){
        this.setState({textErr:"Name or select database"});
      }
    else if (!this.state.filepath){
      this.setState({textErr:"Error with upload.Try again"});
    }
  }
  
  getInputValue(evt) {
    const regexp = /^[A-z][A-z0-9]+$/;
    const val = evt.target.value; 
    if (regexp.test(val)){
      this.setState({
        textErr:null,
        tableName:evt.target.value
      });
    }
    else{
      this.setState({
        textErr: "Not correct table name",
        tableName: ""
      });
    }
  }

  onFilesAdded(files) {
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

  async insertTable(url, data) { 
    this.setState({importing:true});
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    await fetch(url, requestOptions)
          .then(async response => {
              if (!response.ok) {
                  const error = response.text || response.status;
                  return Promise.reject(error);
              }
              const respData = await response.json();
              this.setState({importing: false, importStatus:respData.value, importFinished: true, successfullImport: respData.success })
          })
          .catch(error => {
              this.setState({importing: false, importStatus:error.message, importFinished:true, successfullImport: false})
          });
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
         if (req.readyState === 4 ) {
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
          console.log(res.value)

          this.setState({ successfullUploaded: true, uploading: false, filepath: res.value});
          //TO DO: norm handler here
        }.bind(this), function(reason){
          this.setState({ successfullUploaded: false, uploading: false, filepath: null });
        }.bind(this))
  }

  renderProgress(file) {
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

  renderFileNameContainer() {
    return (
      <div className="FilenameContainer">
          <p className="Filename">Filename: </p>
          <p className="Filename">{this.state.files[0].name}</p>
              <div>
                  <input id="inserttablename" className="InputTable" type="text" 
                    placeholder="Enter table name here" onChange={this.getInputValue}/>
              </div> 
            <p className="TextErr">{this.state.textErr}</p>
      </div>
    );
  }

  renderLoader() {
    return(
      <div className="LoaderContainer">
        <div>
        <Spinner animation="border" variant="dark"/>
        </div>
      </div>
    )
  }

  renderImportResult(){
    return(
      <div className="ResultContainer">
        <div>
          {this.state.successfullImport ? 
            <img
              alt="drop some shit here"
              className="ImportResultIcon"
              src="done.svg"
            /> :
            <img
            alt="drop some shit here"
            className="ImportResultIcon"
            src="error.svg"
          />} 
        </div>
          <p className = "LoadStatus">{this.state.importStatus}</p>
      </div>
    )
  }

  renderActions() {
    return(
      <div className="ButtonContainer">
        {this.state.filepath ?
          <button className = "UploadButton"
              disabled={this.state.textErr || this.state.importing || this.state.importFinished}
              onClick={this.startImportTable}>Import</button>
          : <button className = "UploadButton"
            disabled={this.state.files.length <= 0 || this.state.uploading}
            onClick={this.uploadFile}>
            Upload
          </button>
        }
        <button className="CancelButton" 
          disabled={this.state.files.length <=0}
          onClick={this.cancelImport}>
          Clear
        </button>
    </div>
    )
  }

  render() {
      return (
        <div className="Upload">
          <div className="Content">
            <div className="DropzoneContainer">
              <Dropzone
                onFilesAdded={this.onFilesAdded}
                disabled={this.state.uploading || this.state.successfullUploaded}
              />
            </div>
               {
                 this.state.files.length > 0 
                  ?  <div className="Row">                    
                      {this.state.importing ?  this.renderLoader() : 
                        this.state.importFinished ? this.renderImportResult() : this.renderFileNameContainer()}
                      {this.renderProgress(this.state.files[0])} 
                    </div>
                  : <div className="EmptyRow">
                      <p>Drop some shit here!</p>
                      <img
                        alt="drop some shit here"
                        className="DropIcon"
                        src="left-arrow-sketch.svg"
                      />
                    </div> 
                }  
          </div>
          <div className="Actions">{this.renderActions()}</div>
        </div>
      );
  }
}

export default Upload