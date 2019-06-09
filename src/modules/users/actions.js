import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  // Get the list of users
  getUsers: null,
  getUsersLoading: null,
  getUsersSuccess: ['users'],
  getUsersFailure: ['error'],

  // Login
  login: ['username', 'password'],
  loginLoading: null,
  loginSuccess: ['user'],
  loginFailure: ['error'],

  // Register
  register: ['data'],
  registerLoading: null,
  registerSuccess: ['user'],
  registerFailure: ['error'],

  // Update
  update: ['data'],
  updateLoading: null,
  updateSuccess: ['user'],
  updateFailure: ['error'],

  // Logout
  logout: null,

  // Check is user logged
  checkIsLogged: null,
});

export const UsersTypes = Types;
export default Creators;