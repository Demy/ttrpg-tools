import axios from "axios";
import devLog from "../../helpers/logger";
import { BASE_URL, END_POINT, PUBLIC_ROOM } from "../../utils/constans";
import { 
  NEW_ROLL, FULL_ROLL, ROLL_UID, CLEAR_LAST_ROLL, MOVE_TO_ROOM, 
  ROLLS_HISTORY, SET_SOCKET, ROOM_STATUS, LOGIN_VERIFIED, CLEAR_HISTORY, 
  USER_PARAMS, USERNAME
} from "./constants";

export const setSocket = (socket) => dispatch => {
  dispatch({ type: SET_SOCKET, payload: socket })
};

export const addNewRoll = (data) => dispatch => {
  dispatch({ type: NEW_ROLL, payload: data });
};

export const moveToRoom = (roomId) => dispatch => {
  dispatch({ type: MOVE_TO_ROOM, payload: roomId });
};

export const setLastRollId = (uid) => dispatch => {
  dispatch({ type: ROLL_UID, payload: uid });
};

export const getFullRoll = (rollId, roomId) => dispatch => {
	axios
		.get(`${BASE_URL}${END_POINT.ROLL}?id=${rollId}&room=${roomId}`)
		.then(res => {
	    dispatch({ type: FULL_ROLL, payload: res.data });
		})
		.catch(error => {
			console.log(error);
		});
};

export const clearLastRoll = () => dispatch => {
  dispatch({ type: CLEAR_LAST_ROLL });
};

export const loadRollsHistory = (room) => dispatch => {
  const roomId = room ? room : PUBLIC_ROOM;
	axios
		.get(BASE_URL + END_POINT.ROLLS_HISTORY + '?room=' + roomId)
		.then(res => {
	    dispatch({ type: ROLLS_HISTORY, payload: { history: res.data.history, room: roomId } });
		})
		.catch(error => {
			console.log(error);
		});
};

export const clearHistory = () => dispatch => {
  dispatch({ type: CLEAR_HISTORY });
};

export const getRoomStatus = (room) => dispatch => {
	axios
		.get(BASE_URL + END_POINT.ROOM_STATUS + '?room=' + room)
		.then(res => {
	    dispatch({ type: ROOM_STATUS, payload: res.data });
		})
		.catch(error => {
			console.log(error);
		});
};

export const logInToRoom = (roomId, username, password, onError) => dispatch => {
	axios
		.post(BASE_URL + END_POINT.ROOM_LOGIN, 
      { roomId, password }, 
      { withCredentials: true })
		.then(res => {
	    dispatch({ type: USERNAME, payload: username });
	    dispatch({ type: LOGIN_VERIFIED, payload: true });
		}, onError);
};

export const setUser = (username) => dispatch => {
  dispatch({ type: USERNAME, payload: username });
};

export const setUserParams = (params) => dispatch => {
  dispatch({ type: USER_PARAMS, payload: params });
};

export const setVerified = (value) => dispatch => {
  dispatch({ type: LOGIN_VERIFIED, payload: value });
};

export const verifyLogin = (roomId) => dispatch => {
	axios
		.post(BASE_URL + END_POINT.VERIFY_LOGIN, 
      { roomId }, 
      { withCredentials: true })
		.then(res => {
      dispatch({ type: LOGIN_VERIFIED, payload: true });
		}, error => {
      devLog(error);
    });
};