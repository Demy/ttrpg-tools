import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import rollReducer from './Roll/reducer';
import socketMiddleware from './middleware/socketMiddleware';

const middleware = [thunk, socketMiddleware()];
const initionState = {};
const rootReducer =  combineReducers({
  roll: rollReducer,
});

const store = createStore(rootReducer, initionState, applyMiddleware(...middleware));

export default store;