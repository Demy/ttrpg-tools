import { 
  NEW_ROLL, FULL_ROLL, ROLL_UID, MOVE_TO_PUBLIC_ROOM, 
  PUBLIC_ROOM, 
  CLEAR_LAST_ROLL
} from './constants';

const initialState = {
  rollUid: '',
  room: '',
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
    case MOVE_TO_PUBLIC_ROOM:
      return {
        ...state,
        room: PUBLIC_ROOM
      };
    case NEW_ROLL:
      if (state.rollUid === action.payload.uid) {
        return {
          ...state,
          lastRoll: action.payload
        };
      }
      return state;
    case CLEAR_LAST_ROLL:
      return {
        ...state,
        lastRoll: {
          roll: [],
          id: -1
        },
        rollUid: ''
      };
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