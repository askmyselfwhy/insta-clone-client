import React from 'react'
import { Modal, Input } from 'antd';
import GeoLocation from './GeoLocation';
import GetPhotoFromDevice from './GetPhotoFromDevice';

class UploadImageModal extends React.Component {
  state = {
    title: '',
    description: '',
    image_data: null,
    location: {
      country: '',
      city: ''
    },
    locationCoordinates: {
      lat: 0,
      lng: 0
    }
  }

  setValueState = (name) => (value) => {
    this.setState({
      [name]: value
    })
  }

  setTextFieldValue = (name) => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  onGetCountryName = (location) => {
    this.setState({ location })
  }
  onGetGeoPosition = (geoLocation) => {
    this.setState({ locationCoordinates: geoLocation })
  }
  onSubmit = () => {
    this.props.onOk(this.state)
  }

  render() {
    const { description, title } = this.state;
    const { visible, onCancel } = this.props;
    return (
      <Modal
        title="It's time to make a photo"
        centered
        visible={visible}
        onOk={this.onSubmit}
        onCancel={onCancel}>
        <div className="clearfix">
          <GetPhotoFromDevice
            onImageChange={this.setValueState('image_data')}/>
          <GeoLocation
            onGetGeoPosition={this.setValueState('locationCoordinates')}
            onGetCountryName={this.setValueState('location')}/>
          <div>
            <Input
              value={title}
              onChange={this.setTextFieldValue('title')}
              placeholder={'Title'}
              style={{ marginTop: 8 }}
              type="text"/>
            <Input
              value={description}
              onChange={this.setTextFieldValue('description')}
              placeholder={'Description'}
              style={{ marginTop: 8 }}
              type="text"/>
          </div>
        </div>
      </Modal>
    )
  }
}

export default UploadImageModal;