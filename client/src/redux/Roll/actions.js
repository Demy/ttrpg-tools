import axios from "axios";
import { BASE_URL, END_POINT } from "../../utils/constans";
import { NEW_ROLL, FULL_ROLL } from "./constants";

export const rollDice = (dice, text) => dispatch => {
  const data = { dice, text };
	axios
		.post(BASE_URL + END_POINT.ROLL, data)
		.then(res => {
	    dispatch({ type: NEW_ROLL, payload: res.data });
		})
		.catch(error => {
			console.log(error);
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