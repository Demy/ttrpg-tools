import axios from "axios";
import { BASE_URL, END_POINT } from "../../utils/constans";
import { NEW_ROLL, FULL_ROLL, ROLL_UID } from "./constants";

export const startListeningToRolls = () => dispatch => {
  dispatch({
    event: 'roll',
    handle: data => dispatch({
      type: NEW_ROLL,
      payload: data,
    }),
  });
};

export const stopListeningToRolls = () => dispatch => {
  dispatch({
    event: 'roll',
    leave: true,
  });
};

export const rollDice = (dice, text, uid) => dispatch => {
  dispatch({ type: ROLL_UID, payload: uid });
  dispatch({
    event: 'roll',
    emit: true,
    payload: {
      dice, text, uid
    },
  });
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