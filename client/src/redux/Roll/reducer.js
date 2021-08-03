import { NEW_ROLL, FULL_ROLL } from './constants';

const initialState = {
  lastRoll: {
    roll: [],
    id: -1
  },
  fullRoll: {
    id: -1
  },
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case NEW_ROLL:
      return {
        ...state,
        lastRoll: action.payload
      };
    case FULL_ROLL:
      return {
        ...state,
        fullRoll: action.payload
      };
    default:
      return state;
  }
};

export default reducer;