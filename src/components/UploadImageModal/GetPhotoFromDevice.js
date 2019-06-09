import React from 'react';
import { Input } from 'antd';
import './style.css';

class GetPhotoFromDevice extends React.Component {
  state = {
    videoPlayerDisplay: false,
    imagePickerDisplay: true,
    picture: null
  }
  setRef = (field) => ref => {
    this[field] = ref
  }
  componentDidMount() {
    if (!('mediaDevices' in navigator)) {
      navigator.mediaDevices = {};
    }
    const { webcam, imagePickerArea, capture } = this
    if (!('getUserMedia' in navigator.mediaDevices)) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented!'));
        }
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      }
    }
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        webcam.srcObject = stream;
        webcam.style.display = 'block';
        capture.style.display = 'block';
      })
      .catch(function (err) {
        imagePickerArea.style.display = 'block';
      });
  }

  componentWillUnmount() {
    const { webcam } = this
    if (webcam.srcObject) {
      webcam.srcObject.getVideoTracks().forEach(function (track) {
        track.stop();
      });
    }
  }

  dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  }

  onCaptureClick = (event) => {
    const { canvas, webcam, capture } = this
    canvas.style.display = 'block';
    webcam.style.display = 'none';
    capture.style.display = 'none';
    var context = canvas.getContext('2d');
    context.drawImage(webcam, 0, 0, canvas.width, webcam.videoHeight / (webcam.videoWidth / canvas.width));
    webcam.srcObject.getVideoTracks().forEach((track) => track.stop());
    const imageBlob = this.dataURItoBlob(canvas.toDataURL());
    this.setState({ picture: imageBlob })
  }

  onAddFiles = (event) => {
    const imageBlob = event.target.files[0];
    this.props.onImageChange(imageBlob)
    this.setState({ picture: imageBlob })
  }

  render() {
    return (
      <div style={{ marginTop: 4, marginBottom: 4 }}>
        <div style={{ display: 'flex', flexDirection: 'column'}}>
          <video id="player" autoPlay ref={this.setRef('webcam')}></video>
          <canvas id="canvas" width="320px" height="240px" ref={this.setRef('canvas')}></canvas>
          <button
            id="capture"
            ref={this.setRef('capture')}
            onClick={this.onCaptureClick}>
            Capture
          </button>
        </div>
        <div id="pick-image" ref={this.setRef('imagePickerArea')}>
          <h6>Pick an Image</h6>
          <Input
            onChange={this.onAddFiles}
            style={{ padding: 0  }}
            type="file"
            accept="image/*"
            id="image-picker"/>
        </div>
      </div>
    )
  }
}

export default GetPhotoFromDevice;