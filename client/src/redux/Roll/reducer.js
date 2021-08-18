import { NEW_ROLL, FULL_ROLL, ROLL_UID } from './constants';

const initialState = {
  rollUid: '',
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
      console.log(action.payload);
      console.log(state.rollUid, action.payload.uid);
      if (state.rollUid === action.payload.uid) {
        return {
          ...state,
          lastRoll: action.payload
        };
      }
      return state;
    case FULL_ROLL:
      return {
        ...state,
        fullRoll: action.payload
      };
    case ROLL_UID:
      return {
        ...state,
        rollUid: action.payload
      };
    default:
      return state;
  }
};

export default reducer;