import { createReducer } from 'reduxsauce';

import { INITIAL_STATE } from './initialState';
import { AppTypes } from './actions';

export const setDefferedPrompt = (state, { newSubscription }) => {
  return state.merge({
    is_subscribed: true
  })
}

export const reducer = createReducer(INITIAL_STATE, {
  [AppTypes.ENABLE_NOTIFICATIONS_SUCCESS]: setDefferedPrompt,
})