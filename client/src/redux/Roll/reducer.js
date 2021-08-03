import { NEW_ROLL } from './constants';

const initialState = {
  lastRoll: [],
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case NEW_ROLL:
      return {
        ...state,
        lastRoll: action.payload
      }
    default:
      return state;
  }
};

export default reducer;