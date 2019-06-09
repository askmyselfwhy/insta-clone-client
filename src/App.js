import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import AppConfigure from './components/AppConfigure';
import getStore from './store';
import './App.css';
import 'antd/dist/antd.css';

const { store } = getStore();

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  console.log(event)
  event.preventDefault();
  window.deferredPrompt = event
  return false;
});

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppConfigure/>
      </Router>
    </Provider>
  );
}

export default App;
// <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>Bill is a cat.</div>