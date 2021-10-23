import { 
  NEW_ROLL, FULL_ROLL, ROLL_UID, 
  CLEAR_LAST_ROLL, MOVE_TO_ROOM, ROLLS_HISTORY,
  SET_SOCKET, ROOM_STATUS, ROOM_TOKEN
} from './constants';

const defaultLastRoll = {
  res: [],
  id: -1
};

const initialState = {
  socket: null,
  rollUid: '',
  roomName: '',
  roomStatus: null,
  roomToken: '',
  lastRoll: defaultLastRoll,
  fullRoll: {
    id: -1
  },
  history: null,
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_SOCKET:
      return {
        ...state,
        socket: action.payload
      };
    case MOVE_TO_ROOM:
      return {
        ...state,
        roomName: action.payload,
        lastRoll: defaultLastRoll,
        rollUid: '',
        history: null,
      };
    case NEW_ROLL:
      let lastRoll = state.lastRoll;
      let history = state.history ? state.history.concat() : [];
      history.unshift({ 
        ...action.payload,
        time: new Date(action.payload.time) 
      });
      if (history.length > 10) {
        history.pop();
      }
      if (state.rollUid === action.payload.uid) {
        lastRoll = action.payload;
      }
      return {
        ...state,
        lastRoll,
        history
      };
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
      if (action.payload.history && state.roomName === action.payload.room) {
        return {
          ...state,
          history: action.payload.history.map(roll => {
            return {
              ...roll,
              time: new Date(roll.time),
              res: JSON.parse(roll.res)
            };
          })
        };
      }
      return state;
    case ROOM_STATUS:
      return {
        ...state,
        roomStatus: action.payload
      };
    case ROOM_TOKEN:
      return {
        ...state,
        roomToken: action.payload
      }
    default:
      return state;
  }
};

export default reducer;