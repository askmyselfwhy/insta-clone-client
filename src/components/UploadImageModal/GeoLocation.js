import React from 'react'
import { Button, Input } from 'antd';

class GeoLocation extends React.Component {
  state = {
    display: true,
    loading: false,
    locationInput: ''
  }

  componentDidMount() {
    if (!('geolocation' in navigator)) {
      this.setState({ display: false })
    }
  }

  onClick = (e) => {
    if (!('geolocation' in navigator)) return;
    const { onGetGeoPosition, onGetCountryName } = this.props;
    const self = this;
    let sawAlert = false;
    this.setState({ loading: true });

    // This should probably be somewhere in utils?
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        self.setState({ loading: false });
        fetch(
          // google geo api to retrieve city and country
          `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAcATn7XnbqO-LaQMpI6jXUaQHSeTEqMCU&latlng=${lat},${lng}`)
          .then(res => res.json())
          .then(({ results }) => {
            if (results[1]) {
              let city;
              let country;
              //find country name
              for (let i = 0; i < results[0].address_components.length; i++) {
                for (let b = 0; b < results[0].address_components[i].types.length; b++) {
                  // there are different types that might hold a city locality usually does in come cases looking for
                  // sublocality type will be more appropriate
                  if (results[0].address_components[i].types[b] === "locality") {
                    city = results[0].address_components[i];
                    break;
                  }
                  if (results[0].address_components[i].types[b] === "country") {
                    country = results[0].address_components[i];
                    break;
                  }
                }
              }
              //city data
              city = city.long_name;
              country = country.long_name;
              onGetCountryName({ city: `In ${city}, ${country}`, country });
              self.setState({ locationInput: `In ${city}, ${country}` });
            }
          })
        onGetGeoPosition({ lat, lng });
      }, (err) => {
        self.setState({ display: true, loading: false });
        onGetGeoPosition({ lat: null, lng: null });
        if (!sawAlert) {
          alert('Couldn\'t fetch location, please enter manually!');
          sawAlert = true;
        }

      }, { timeout: 7000 });
    }, 1000)
  }

  onInputChange = (e) => {
    this.props.onGetCountryName({ city: e.target.value, country: '' });
  }

  render() {
    const { display, loading } = this.state;
    const { location: { city, country } } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        <Input
          onChange={this.onInputChange}
          placeholder="You can enter your location here"
          value={city} />
        {
          display
            ? <Button style={{ marginLeft: 4 }} onClick={this.onClick} loading={loading}>Get location</Button>
            : null
        }
      </div>
    )
  }
}

export default GeoLocation;