import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import roomReducer from './room/reducer';

const middleware = [thunk];
const initionState = {};
const rootReducer =  combineReducers({
  room: roomReducer,
});

const store = createStore(rootReducer, initionState, applyMiddleware(...middleware));

export default store;