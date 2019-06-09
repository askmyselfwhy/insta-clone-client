import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  enableNotifications: ['subscription'],
  enableNotificationsLoading: null,
  enableNotificationsSuccess: null,
  enableNotificationsFailure: ['errorMessage'],

  disableNotifications: ['subscription'],
  disableNotificationsLoading: null,
  disableNotificationsSuccess: null,
  disableNotificationsFailure: ['errorMessage'],
});

export const AppTypes = Types;
export default Creators;