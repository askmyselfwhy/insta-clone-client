import { put, takeLatest, fork, call } from 'redux-saga/effects';
import AppActions, { AppTypes } from './actions';
import axios from '../../utils/axios';

// Sagas
function * subscribe ({ subscription }) {
  yield put(AppActions.enableNotificationsLoading());
  try {
    const { data: newSubscription } = yield call(axios.post, '/subscribe',
      JSON.stringify(subscription)
    );
    yield put(AppActions.enableNotificationsSuccess(newSubscription));
  } catch (error) {
    yield put(AppActions.enableNotificationsFailure(error));
  }
}

function * unsubscribe ({ subscription }) {
  yield put(AppActions.disableNotificationsLoading());
  try {
    const { data: newSubscription } = yield call(axios.put, '/subscribe',
      JSON.stringify(subscription)
    );
    yield put(AppActions.disableNotificationsSuccess(newSubscription));
  } catch (error) {
    yield put(AppActions.disableNotificationsFailure(error));
  }
}

// Watchers
function * subscribeWatcher() {
  yield takeLatest(AppTypes.ENABLE_NOTIFICATIONS, subscribe);
}

function * unsubscribeWatcher() {
  yield takeLatest(AppTypes.DISABLE_NOTIFICATIONS, unsubscribe);
}

export default function * root () {
  yield fork(subscribeWatcher);
  yield fork(unsubscribeWatcher);
}