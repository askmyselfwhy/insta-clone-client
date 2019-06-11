import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { urlBase64ToUint8Array } from '../utils/encoding';
import EditAccountForm from '../components/EditAccountForm';
import AppActions from '../modules/app/actions';
import { getCurrentUser } from '../modules/users/selectors';
import { publicVapidKey } from '../config';

class Settings extends React.Component {
  state = {
    subscribed: false
  };

  componentDidMount() {
    if (!('serviceWorker' in navigator)) return;
    const self = this;
    navigator.serviceWorker.ready
      .then(function (swreg) {
        return swreg.pushManager.getSubscription();
      })
      .then(function (sub) {
        if (sub === null) {
          self.setState({ subscribed: false });
        } else {
          self.setState({ subscribed: true });
        }
      });
  }

  configurePushSub = () => {
    const { onSubscribe, onUnsubscribe } = this.props;
    if (!('serviceWorker' in navigator)) return;
    var reg;
    const self = this;
    navigator.serviceWorker.ready
      .then(function (swreg) {
        reg = swreg;
        return swreg.pushManager.getSubscription();
      })
      .then(function (sub) {
        if (sub === null) {
          // Create a new subscription
          const convertedVapidPublicKey = urlBase64ToUint8Array(publicVapidKey);
          self.setState({ subscribed: true });
          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidPublicKey
          });
        } else {
          // Have a subscription
          return sub.unsubscribe().then(function (successful) {
            self.setState({ subscribed: false });
            onUnsubscribe(sub);
            // Returning null to not subscribe again in same the session
            return null;
          }).catch(function (e) {
            // Unsubscription failed
          })
        }
      })
      .then((newSub) => {
        if (newSub) {
          self.setState({ subscribed: true });
          onSubscribe(newSub);
        }
      });
  }

  configureNotifications = () => {
    const self = this;
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission(function (result) {
        if (result !== 'granted') {
          console.log('No notification permission granted!');
        } else {
          self.configurePushSub();
        }
      });
    }
  }

  render() {
    const { subscribed } = this.state;
    const { currentUser } = this.props;
    return (
      <div>
        <Button onClick={this.configureNotifications}>
          {subscribed
            ? 'Disable push notifications'
            : 'Enable push notifications'
          }
        </Button>
        <EditAccountForm user={currentUser} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
})

const mapDispatchToProps = dispatch => ({
  onSubscribe: (subscription) => {
    dispatch(AppActions.enableNotifications(subscription))
  },
  onUnsubscribe: (subscription) => {
    dispatch(AppActions.disableNotifications(subscription))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
