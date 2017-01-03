import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Field, reduxForm } from 'redux-form';
import { post } from 'axios';
import { Line, Circle } from 'rc-progress';
import { v4 } from 'node-uuid';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.onOpenClick = this.onOpenClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      files: [],
      percentCompleted: 0
    }
  }

  onFormSubmit(data) {
    const url = '/upload';
    let formData = new FormData();
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('picture', data.picture)
    console.log("formData", formData);
    const config = {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
          this.setState({ percentCompleted: percentCompleted });
        }.bind(this)
    }

    post(url, formData, config)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
  }

  onDrop(acceptedFiles) {
    this.setState({
      files: acceptedFiles
    });
    console.log("onDrop", this.state.files);

    acceptedFiles.forEach((file)=> {
      const data = {
        name: "dora1",
        description: "dora1 description",
        picture: file
      }
      console.log("file", JSON.stringify(data));

      this.onFormSubmit(data);
    });

  }

  onOpenClick() {
    this.dropzone.open();
    console.log("onOpenClick", this.state.files);
  }

  renderThumb(file, idx) {
    return (
      <div className="col-md-2" key={ v4() }>
        <img key={ v4() } src={file.preview} className="img-thumbnail" />
      </div>
    )
  }

  renderThumbPreview() {
    if (this.state.files.length > 0) {
      const file = this.state.files[0];
      return (
        <div>
          <img key={ v4() } src={file.preview} className="img-thumbnail" width="200" />
        </div>
      )
    } else {
      return (
        <div>Try dropping some files here, or click to select files to upload.</div>
      )
    }
  }

  render() {
    const progress = this.state.percentCompleted;
    return (
      <div className="col-md-12">
        <div className="row">
          <Dropzone ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
              { this.renderThumbPreview() }
          </Dropzone>
          <div className="pull-left">
            <br />
            <button type="button" className="btn" onClick={this.onOpenClick}>
              Open files
            </button>
          </div>
        </div>
        <div className="row">
          <p>{progress} %</p>
          <Line percent={progress} strokeWidth="4" strokeColor="#00ff00" />
          {/* <Circle percent={progress} strokeWidth="4" strokeColor="#D3D3D3" /> */}
        </div>

        {this.state.files.length > 0 ? <div>
        <h2>Uploading {this.state.files.length} files...</h2>
        <div className="row">
          {this.state.files.map((file, idx) => this.renderThumb(file, idx) )}
        </div>
        </div> : null}
      </div>
    )
  }
}

export default Upload
