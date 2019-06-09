import axios from '../../utils/axios';
import { createReducer } from 'reduxsauce';
import { INITIAL_STATE } from './initialState';
import { UsersTypes } from './actions';
import { saveToLocalStorage, removeFromLocalStorage, getFromLocalStorage } from './utils';

export const getUsersLoading = (state) =>
  state.merge({
    getUsersLoading: true,
    getUsersError: null,
  })

export const getUsersSuccess = (state, { users }) =>
  state.merge({
    users,
    getUsersLoading: false,
  })

export const getUsersFailure = (state, { error }) =>
  state.merge({
    users: [],
    getUsersLoading: false,
    getUsersError: error,
  })

export const loginLoading = (state) =>
  state.merge({
    loginLoading: true,
    loginError: null,
  })

export const loginSuccess = (state, { user }) => {
  const token = user.token;
  saveToLocalStorage(user);
  return state.merge({
    currentUser: user.user,
    token,
    axiosInterceptor: axios.interceptors.request.use(function (config) {
      config.headers.Authorization =  token ? token : '';
      return config;
    })
  })
}

export const loginFailure = (state, { error }) =>
  state.merge({
    currentUser: null,
    token: null,
    loginLoading: false,
    loginError: error,
  })


export const logout = (state) => {
  const axiosInterceptor = state.get('axiosInterceptor')
  if (axiosInterceptor) {
    axios.interceptors.request.eject(axiosInterceptor);
  }
  removeFromLocalStorage();
  return state.merge({
    currentUser: null,
    token: null,
    axiosInterceptor: null
  })
}


export const registerLoading = (state) =>
  state.merge({
    registerLoading: true,
    registerError: null,
  })

export const registerSuccess = (state, { user }) => {
  const token = user.token;
  return state.merge({
    currentUser: user.user,
    token: user.token,
    axiosInterceptor: axios.interceptors.request.use(function (config) {
      config.headers.Authorization =  token ? token : '';
      return config;
    })
  })
}

export const registerFailure = (state, { error }) =>
  state.merge({
    currentUser: null,
    token: null,
    registerLoading: false,
    registerError: error,
  })

export const updateLoading = (state) =>
  state.merge({
    updateLoading: true,
    updateError: null,
  })

export const updateSuccess = (state, { user }) => {
  return state.merge({
    currentUser: user,
    updateLoading: false,
  })
}

export const updateFailure = (state, { error }) =>
  state.merge({
    updateLoading: false,
    updateError: error,
  })

export const checkIsLogged = (state) => {
  const localStorageData = getFromLocalStorage();
  if (localStorageData) {
    return state.merge({
      currentUser: localStorageData.user,
      token: localStorageData.token,
      axiosInterceptor: axios.interceptors.request.use(function (config) {
        config.headers.Authorization = localStorageData.token;
        return config;
      })
    })
  }
  return state.merge({});
}

export const reducer = createReducer(INITIAL_STATE, {
  [UsersTypes.GET_USERS_LOADING]: getUsersLoading,
  [UsersTypes.GET_USERS_SUCCESS]: getUsersSuccess,
  [UsersTypes.GET_USERS_FAILURE]: getUsersFailure,

  [UsersTypes.LOGIN_LOADING]: loginLoading,
  [UsersTypes.LOGIN_SUCCESS]: loginSuccess,
  [UsersTypes.LOGIN_FAILURE]: loginFailure,

  [UsersTypes.REGISTER_LOADING]: registerLoading,
  [UsersTypes.REGISTER_SUCCESS]: registerSuccess,
  [UsersTypes.REGISTER_FAILURE]: registerFailure,

  [UsersTypes.UPDATE_LOADING]: updateLoading,
  [UsersTypes.UPDATE_SUCCESS]: updateSuccess,
  [UsersTypes.UPDATE_FAILURE]: updateFailure,

  [UsersTypes.CHECK_IS_LOGGED]: checkIsLogged,

  [UsersTypes.LOGOUT]: logout,
})