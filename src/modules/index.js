import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';

import { reducer as postsReducer } from './posts/reducers';
import { reducer as usersReducer } from './users/reducers';
import { reducer as appReducer } from './app/reducers';

import postsSagas from './posts/sagas';
import usersSagas from './users/sagas';
import appSagas from './app/sagas';

export const rootReducer = combineReducers({
  posts: postsReducer,
  users: usersReducer,
  app: appReducer,
});

export function * rootSaga () {
  yield all([
    fork(postsSagas),
    fork(usersSagas),
    fork(appSagas),
  ]);
};