import { 
  NEW_ROLL, FULL_ROLL, ROLL_UID, MOVE_TO_PUBLIC_ROOM, CLEAR_LAST_ROLL, MOVE_TO_ROOM, ROLLS_HISTORY,
  PUBLIC_ROOM
} from './constants';

const defaultLastRoll = {
  roll: [],
  id: -1
};

const initialState = {
  rollUid: '',
  room: '',
  lastRoll: defaultLastRoll,
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
    case MOVE_TO_ROOM:
      return {
        ...state,
        room: action.payload,
        lastRoll: defaultLastRoll,
        rollUid: ''
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
        lastRoll: defaultLastRoll,
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
    case ROLLS_HISTORY:
      if (action.payload.history && 
          (state.room === action.payload.room || 
          (state.room === PUBLIC_ROOM && !action.payload.room))) {
        return {
          ...state,
          history: action.payload.history.map(roll => {
            return {
              time: new Date(roll.time),
              text: roll.text,
              res: JSON.parse(roll.res)
            };
          })
        };
      }
      return state;
    default:
      return state;
  }
};

export default reducer;