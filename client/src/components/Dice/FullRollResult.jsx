import React, { useEffect, useLayoutEffect, useRef } from 'react';
import Die from './Die';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import * as actions from '../../redux/room/actions';
import { useTranslation } from 'react-i18next';
import { L18N_NAMESPACE, PUBLIC_ROOM } from '../../utils/constans';

const DiceContainer = styled.div`
  width: 100%;
  position: relative;
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
const RoomName = styled.h4`
  font-weight: normal;
  color: #898989;
  padding: 0.5em;
  margin: 0;
`;

export default function FullRollResult() {

  let { rollId, roomId } = useParams();

  const fullRoll = useSelector(state => state.room.fullRoll);
  const dispatch = useDispatch();

  const [lang] = useTranslation(L18N_NAMESPACE);

  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef && containerRef.current) {
      let scrollHeight = document.documentElement.clientHeight;
      const height = containerRef.current.offsetHeight || containerRef.current.clientHeight;
      if (height < scrollHeight) {
        containerRef.current.style.marginTop = `${(scrollHeight - height) / 2}px`;
      }
    }
  });

  useEffect(() => {
    if (rollId && roomId && fullRoll && 
        fullRoll.id && fullRoll.id.toString() !== rollId) {
      dispatch(actions.getFullRoll(+rollId, roomId));
    }
  }, [rollId, fullRoll, dispatch, roomId]);

  const addDiceFrom = (die, index) => {
    const result = [];
    const values = die.res;
    for (let j = 0; j < values.length; j++) {
      result.push(
        <DieContainer 
          id={`die${index}-${j}`}
          key={`die${index}-${die.die}-${die.color}-${j}`} 
        >
          <Die sides={die.die} color={die.color} value={values[j]} size="big" />
        </DieContainer>
      );
    }
    return result;
  };

  if (!fullRoll) {
    return <DiceContainer>{lang('no_roll')}</DiceContainer>;
  } else if (fullRoll && fullRoll.id === -1) {
    return <DiceContainer>{lang('loading')}...</DiceContainer>;
  }
  
  let roll = [];
  if (fullRoll.res) {
    roll = JSON.parse(fullRoll.res);
  }
  const date = new Date(fullRoll.time);

  return (
    <DiceContainer ref={containerRef}>
      {fullRoll.text ? <h3>{fullRoll.text}</h3> : <></>}
      <Dice id="rollResult">
        {roll.map((die, i) => addDiceFrom(die, i))}
      </Dice>
      <RoomName>{lang('room')}: {lang(roomId === PUBLIC_ROOM ? 'public_room' : 'private_room')}</RoomName>
      {lang('date')}: {date.toLocaleString()}
    </DiceContainer>
  );
}