import React from 'react';
import { Input, Button } from 'antd';
import './style.css';
import { dataURItoBlob } from '../../utils/encoding';

class GetPhotoFromDevice extends React.Component {
  state = {
    picture: null,
    mounted: false
  }

  componentDidMount() {
    this.isMediaReady();
  }

  componentDidUpdate() {
    if (this.capture && !this.state.mounted) {
      this.isMediaReady();
    }
  }

  componentWillUnmount() {
    const { webcam } = this;
    if (webcam.srcObject) {
      webcam.srcObject.getVideoTracks().forEach(function (track) {
        track.stop();
      });
    }
  }

  isMediaReady = () => {
    if (!('mediaDevices' in navigator)) navigator.mediaDevices = {};
    const self = this;
    const { webcam, imagePickerArea, capture } = this;
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
        capture.buttonNode.style.display = 'block';
        imagePickerArea.style.display = 'none';
        self.setState({ mounted: true });
      })
      .catch(function (err) {
        imagePickerArea.style.display = 'block';
      });
  }

  // Generic setRef function
  setRef = (field) => ref => this[field] = ref

  onCaptureClick = (event) => {
    const { canvas, webcam, capture } = this;
    canvas.style.display = 'block';
    webcam.style.display = 'none';
    capture.buttonNode.style.display = 'none';
    var context = canvas.getContext('2d');
    context.drawImage(webcam, 0, 0, canvas.width, webcam.videoHeight / (webcam.videoWidth / canvas.width));
    webcam.srcObject.getVideoTracks().forEach((track) => track.stop());
    const imageBlob = dataURItoBlob(canvas.toDataURL());
    this.props.onImageChange(imageBlob);
    this.setState({ picture: imageBlob });
  }

  onAddFiles = (event) => {
    const imageBlob = event.target.files[0];
    this.props.onImageChange(imageBlob);
    this.setState({ picture: imageBlob });
  }

  render() {
    // It will be better to wrap canvas and video in React components
    // and provide some interface back to user (playing video, stop tracks, ...etc)
    return (
      <div style={{ marginTop: 4, marginBottom: 4 }}>
        <div style={{ overflow: 'hidden' }}>
          <video id="player" autoPlay ref={this.setRef('webcam')}></video>
          <canvas id="canvas" width="320px" height="240px" ref={this.setRef('canvas')}></canvas>
          <Button
            type="primary"
            id="capture"
            block
            ref={this.setRef('capture')}
            onClick={this.onCaptureClick}>
            Capture
          </Button>
        </div>
        <div id="pick-image" ref={this.setRef('imagePickerArea')}>
          <h6>Pick an Image</h6>
          <Input
            onChange={this.onAddFiles}
            style={{ padding: 0 }}
            type="file"
            accept="image/*"
            id="image-picker" />
        </div>
      </div>
    )
  }
}

export default GetPhotoFromDevice;