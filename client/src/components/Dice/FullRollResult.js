import React, { useEffect } from 'react';
import Die from './Die';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import * as actions from '../../redux/Roll/actions';

const DiceContainer = styled.div`
  width: 100%;
  margin-top: 25%;
`;
const DieContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  padding: 2px;
`;
const Dice = styled.div`
  padding: 10px;
  text-align: center;
`;

export default function FullRollResult(props) {

  let { rollId } = useParams();

  const fullRoll = useSelector(state => state.roll.fullRoll);
  const dispatch = useDispatch();

  useEffect(() => {
    if (rollId && fullRoll && fullRoll.id.toString() !== rollId) {
      dispatch(actions.getFullRoll(+rollId));
    }
  }, [rollId, fullRoll, dispatch]);

  const addDiceFrom = (die, index) => {
    const result = [];
    const values = die.res;
    for (let j = 0; j < values.length; j++) {
      result.push(
        <DieContainer key={`selected${index}-${die.die}-${die.color}-${j}`} >
          <Die sides={die.die} color={die.color} value={values[j]} size="small" />
        </DieContainer>
      );
    }
    return result;
  };

  if (!fullRoll) {
    return <DiceContainer>This roll was not made (yet?)</DiceContainer>;
  } else if (fullRoll.id === -1) {
    return <DiceContainer>Loading...</DiceContainer>;
  }
  
  let roll = [];
  if (fullRoll.res) {
    roll = JSON.parse(fullRoll.res);
  }
  const date = new Date(fullRoll.time);

  return (
    <DiceContainer>
      {fullRoll.title ? <h3>{fullRoll.title}</h3> : <></>}
      <Dice>
        {roll.map((die, i) => addDiceFrom(die, `selected${i}`))}
      </Dice>
      Date: {date.toUTCString()}
    </DiceContainer>
  );
}