import axios from "axios";
import { BASE_URL, END_POINT } from "../../utils/constans";
import { NEW_ROLL } from "./constants";


export const rollDice = (dice) => dispatch => {
  const data = dice;
	axios
		.post(BASE_URL + END_POINT.ROLL, data)
		.then(res => {
	    dispatch({ type: NEW_ROLL, payload: res.data });
		})
		.catch(error => {
			console.log(error);
		});
};