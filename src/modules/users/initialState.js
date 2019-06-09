import { Map } from 'immutable';

export const INITIAL_STATE = Map({
  axiosInterceptor: null,
  users: [],
  currentUser: null,
  token: null,
  getUsersLoading: false,
  getUsersError: null,

  loginLoading: false,
  loginError: null,

  registerLoading: false,
  registerError: null,

  updateLoading: false,
  updateError: null,
});