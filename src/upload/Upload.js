import React, { Component } from 'react'
import './Upload.css'
import Dropzone from '../dropzone/Dropzone'
import CircularProgressBar from '../circularprogress/CircularProgressBar'

class Upload extends Component {
  constructor(props) {
      super(props);
      this.state = {
        files: [],
        uploading: false,
        uploadProgress: {},
        canUpload: true,
        successfullUploaded: false
      };
  
      this.onFilesAdded = this.onFilesAdded.bind(this);
      this.uploadFiles = this.uploadFiles.bind(this);
      this.sendRequest = this.sendRequest.bind(this);
      this.renderActions = this.renderActions.bind(this);
    }
  
  onFilesAdded(files) {
  this.setState(() => ({
      //files: prevState.files.concat(files)
      files: [files]
  }));
  }

  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
      return (
        <div className="ProgressContainer">
        <CircularProgressBar
            strokeWidth="2"
            sqSize="200"
            percentage={uploadProgress ? uploadProgress.percentage : 0}/>
        </div>
      );
  }

  renderActions() {
    if (!this.state.canUpload) {
      return (
        <button className = "upload_button"
          onClick={() =>
            this.setState({ files: [], successfullUploaded: false, canUpload: true })
          }
        >
          Clear
        </button>
      );
    } else {
      return (
        <button className = "upload_button"
          disabled={this.state.files.length <= 0 || this.state.uploading}
          onClick={this.uploadFiles}
        >
          Upload
        </button>
      );
    }
  }

  sendRequest(file) {
    return new Promise((resolve, reject) => {
     const req = new XMLHttpRequest();
   
     req.upload.addEventListener("progress", event => {
      if (event.lengthComputable) {
       const copy = { ...this.state.uploadProgress };
       copy[file.name] = {
        state: "pending",
        percentage: (event.loaded / event.total) * 100
       };
       this.setState({ uploadProgress: copy });
      }
     });
      
     req.upload.addEventListener("load", event => {
      const copy = { ...this.state.uploadProgress };
      copy[file.name] = { state: "done", percentage: 100 };
      this.setState({ uploadProgress: copy });
      resolve(req.response);
     });
      
     req.upload.addEventListener("error", event => {
      const copy = { ...this.state.uploadProgress };
      copy[file.name] = { state: "error", percentage: 0 };
      this.setState({ uploadProgress: copy });
      reject(req.response);
     });
   
     const formData = new FormData();
     console.log(file);
     formData.append("file", file, file.name);
     console.log(formData);
   
     req.open("POST", "http://localhost:9000/api/upload");
     req.send(formData);
    });
   }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    this.state.files.forEach(file => {
      promises.push(this.sendRequest(file));
    });
    try {
      await Promise.all(promises);
  
      this.setState({ successfullUploaded: true, uploading: false, canUpload: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      console.log("catched err")
      this.setState({ successfullUploaded: false, uploading: false, canUpload: false });
    }
  }

  render() {
      return (
        <div className="Upload">
          <span className="Title">Select file or drop it on uploading zone to upload</span>
          <div className="Content">
            <div>
              <Dropzone
                onFilesAdded={this.onFilesAdded}
                disabled={this.state.uploading || this.state.successfullUploaded}
              />
            </div>
            <div className="Files">
              { this.state.files.map(file => {   /* TO DO: write norm handling */
                  return (
                    <div key={file.name} className="Row">
                      <div className="FilenameContainer">
                      <span className="Filename">{file.name}</span>
                      </div>
                      {this.renderProgress(file)} 
                    </div>
                  );
                })
               }
            </div>
          </div>
          <div className="Actions">{this.renderActions()}</div>
        </div>
      );
    }
  }

export default Upload