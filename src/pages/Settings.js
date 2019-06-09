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
    if (!('serviceWorker' in navigator)) {
      return;
    }
    const self = this;
    navigator.serviceWorker.ready
      .then(function(swreg) {
        return swreg.pushManager.getSubscription();
      })
      .then(function(sub) {
        if (sub === null) {
          self.setState({ subscribed: false })
        } else {
          self.setState({ subscribed: true })
        }
      })
  }

  configurePushSub = () => {
    const { onSubscribe, onUnsubscribe } = this.props;
    if (!('serviceWorker' in navigator)) {
      return;
    }
    var reg;
    const self = this;
    navigator.serviceWorker.ready
      .then(function(swreg) {
        reg = swreg;
        return swreg.pushManager.getSubscription();
      })
      .then(function(sub) {
        if (sub === null) {
          // Create a new subscription
          var vapidPublicKey = publicVapidKey;
          var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
          self.setState({ subscribed: true });
          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidPublicKey
          });
        } else {
          // We have a subscription
          return sub.unsubscribe().then(function(successful) {
            self.setState({ subscribed: false })
            onUnsubscribe(sub);
            return null
          }).catch(function(e) {
            // Unsubscription failed
          })
        }
      })
      .then((newSub) => {
        if (newSub) {
          self.setState({ subscribed: true });
          onSubscribe(newSub);
        }
      })
  }

  configureNotifications = () => {
    const self = this;
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission(function(result) {
        if (result !== 'granted') {
          console.log('No notification permission granted!');
        } else {
          self.configurePushSub();
          // displayConfirmNotification();
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
          {subscribed ? 'Disable push notifications' : 'Enable push notifications' }
        </Button>
        <EditAccountForm user={currentUser}/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
})

const mapDispatchToProps = dispatch => ({
  onSubscribe: (subscription) =>  {
    dispatch(AppActions.enableNotifications(subscription))
  },
  onUnsubscribe: (subscription) =>  {
    dispatch(AppActions.disableNotifications(subscription))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

    /*
    function displayConfirmNotification() {
      if ('serviceWorker' in navigator) {
        var options = {
          body: 'You successfully subscribed to our Notification service!',
          icon: '/src/images/icons/app-icon-96x96.png',
          dir: 'ltr',
          lang: 'en-US', // BCP 47,
          vibrate: [100, 50, 200],
          badge: '/src/images/icons/app-icon-96x96.png',
          tag: 'confirm-notification',
          renotify: true,
          actions: [
            { action: 'confirm', title: 'Okay', icon: '/src/images/icons/app-icon-96x96.png' },
            { action: 'cancel', title: 'Cancel', icon: '/src/images/icons/app-icon-96x96.png' }
          ]
        };
    
        navigator.serviceWorker.ready
          .then(function(swreg) {
            swreg.showNotification('Successfully subscribed!', options);
          });
      }
    }
    */