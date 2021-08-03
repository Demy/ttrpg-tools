import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import rollReducer from './Roll/reducer';

const middleware = [thunk];
const initionState = {};
const rootReducer =  combineReducers({
  roll: rollReducer,
});

const store = createStore(rootReducer, initionState, applyMiddleware(...middleware));

export default store;