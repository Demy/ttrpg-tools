import axios from "axios";
import { BASE_URL, END_POINT } from "../../utils/constans";
import { toast } from 'react-toastify';
import { 
  NEW_ROLL, FULL_ROLL, ROLL_UID, MOVE_TO_PUBLIC_ROOM, 
  CLEAR_LAST_ROLL, MOVE_TO_ROOM, ROLLS_HISTORY, SET_SOCKET,
  ROOM_STATUS, ROOM_TOKEN
} from "./constants";

export const setSocket = (socket) => dispatch => {
  dispatch({ type: SET_SOCKET, payload: socket })
};

export const moveToPublicRoom = () => dispatch => {
  dispatch({ type: MOVE_TO_PUBLIC_ROOM });
};

export const addNewRoll = (data) => dispatch => {
  dispatch({ type: NEW_ROLL, payload: data });
};

export const moveToRoom = (roomId) => dispatch => {
  console.log('moveToRoom ' + roomId);
  dispatch({ type: MOVE_TO_ROOM, payload: roomId });
};

export const setLastRollId = (uid) => dispatch => {
  dispatch({ type: ROLL_UID, payload: uid });
};

export const getFullRoll = (rollId) => dispatch => {
	axios
		.get(BASE_URL + END_POINT.ROLL + '?id=' + rollId)
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
	axios
		.get(BASE_URL + END_POINT.ROLLS_HISTORY + (room ? '?room=' + room : ''))
		.then(res => {
	    dispatch({ type: ROLLS_HISTORY, payload: { history: res.data.history, room } });
		})
		.catch(error => {
			console.log(error);
		});
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

export const logInToRoom = (roomId, password) => dispatch => {
	axios
		.post(BASE_URL + END_POINT.ROOM_LOGIN, { roomId, password })
		.then(res => {
	    dispatch({ type: ROOM_TOKEN, payload: res.data.token });
		}, error => {
			toast.error('Incorrect password', {
        position: toast.POSITION.TOP_RIGHT,
        toastId: 'error',
        autoClose: 2000,
        hideProgressBar: true,
      });
		});
};

export const setToken = (token) => dispatch => {
  dispatch({ type: ROOM_TOKEN, payload: token });
};

export const verifyToken = (token) => dispatch => {
	axios
		.post(BASE_URL + END_POINT.VERIFY_TOKEN, { token })
		.then(res => {
	    dispatch({ type: ROOM_TOKEN, payload: token });
		}, error => {});
};