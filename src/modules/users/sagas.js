import { put, takeLatest, fork, call, select } from 'redux-saga/effects';
import UsersActions, { UsersTypes } from './actions';
import axios from '../../utils/axios';
import { notification } from 'antd';
import { getCurrentUser } from './selectors';

// Sagas
function * getUsers () {
  yield put(UsersActions.getUsersLoading());
  try {
    const { data: posts } = yield call(axios.get, '/users');
    yield put(UsersActions.getUsersSuccess(posts));
  } catch (error) {
    yield put(UsersActions.getUsersFailure(error));
  }
}

function * login ({ username, password }) {
  yield put(UsersActions.loginLoading());
  try {
    const { data } = yield call(axios.post, '/login', {
      username,
      password
    });
    yield put(UsersActions.loginSuccess(data));
  } catch (error) {
    notification.error({
      message: 'Error ',
      description: error.message,
    })
    yield put(UsersActions.loginFailure(error));
  }
}

function * register ({ data }) {
  const { username, password, first_name, last_name } = data;
  yield put(UsersActions.registerLoading());
  try {
    const { data: registeredUser } = yield call(axios.post, '/register', {
      username,
      password,
      first_name,
      last_name
    });
    yield put(UsersActions.registerSuccess(registeredUser));
  } catch (error) {
    yield put(UsersActions.registerFailure(error));
  }
}

function * update ({ data }) {
  yield put(UsersActions.updateLoading());
  try {
    const currentUser = yield select(state => getCurrentUser(state));
    const { password, first_name, last_name } = data;
    const { data: updatedUser } = yield call(axios.put, `/users/${currentUser._id}`, {
      ...(typeof password   === 'string' ? { password } : {}),
      ...(typeof first_name === 'string' ? { first_name } : {}),
      ...(typeof last_name  === 'string' ? { last_name } : {}),
    });
    yield put(UsersActions.updateSuccess(updatedUser));
  } catch (error) {
    yield put(UsersActions.updateFailure(error));
  }
}

// Watchers
function * getUsersWatcher() {
  yield takeLatest(UsersTypes.GET_USERS, getUsers);
}

function * loginWatcher() {
  yield takeLatest(UsersTypes.LOGIN, login);
}

function * registerWatcher() {
  yield takeLatest(UsersTypes.REGISTER, register);
}

function * updateWatcher() {
  yield takeLatest(UsersTypes.UPDATE, update);
}

export default function * root () {
  yield fork(getUsersWatcher);
  yield fork(loginWatcher);
  yield fork(registerWatcher);
  yield fork(updateWatcher);
}