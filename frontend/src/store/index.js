import { combineReducers, configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';
import modalReducer from './modalSlice.js';

const reducer = combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
  modal: modalReducer,
});

export default configureStore({
  reducer,
});
