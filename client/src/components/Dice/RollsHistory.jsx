import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as actions from '../../redux/room/actions';
import Die from './Die';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { L18N_NAMESPACE } from '../../utils/constans';

const HistoryTableContainer = styled.div`
  text-align: left;
  padding: 5px 0;
`;
const HistoryLine = styled.div`
  &:nth-child(even) {
    background: rgba(0, 0, 0, 0.05);
  }
  padding: 5px 10px;
`;
const LeftPart = styled.div`
  width: calc(100% - 40px);
  display: inline-block;
  vertical-align: top;
`;
const RightPart = styled.div`
  width: 40px;
  display: inline-block;
  vertical-align: top;
`;
const HistoryDate = styled.div`
  padding: 2px 0;
  font-size: 10px;
  color: ${props => props.theme.colors.primaryDark};
`;
const HistoryLabel = styled.div`
  padding: 0 0 2px 0;
  font-size: 12px;
`;
const LinkButton = styled.div`
  width: 100%;
  cursor: pointer;
  text-align: right;
  opacity: 0.8;
`;

const addZero = (num) => {
  return num < 10 ? `0${num}` : num.toString();
};
const toTimeString = (time) => {
  return `${addZero(time.getHours())}:${addZero(time.getMinutes())}:${addZero(time.getSeconds())}`;
};

export default function RollsHistory() {

  const history = useSelector(state => state.room.history);
  const roomName = useSelector(state => state.room.roomName);

  const [loadedRoom, setLoadedRoom] = useState('');

  const [lang] = useTranslation(L18N_NAMESPACE);

  const dispatch = useDispatch();

  useEffect(() => {
    if (roomName && roomName !== loadedRoom) {
      dispatch(actions.loadRollsHistory(roomName));
      setLoadedRoom(roomName);
    }
  }, [dispatch, loadedRoom, roomName]);

  if (!history) return <></>;

  return (
    <HistoryTableContainer id="history">
      {history.map((roll, id) => (
        <HistoryLine 
          id={`history${id}`}
          key={`history-roll-${id}`}
        >
          <LeftPart>
            {roll.text ? (
              <HistoryLabel id={`historyDescr${id}`}>
                {roll.text}:
              </HistoryLabel>
             ) : <></>}
            <div id={`historyDice${id}`}>
              {roll.res.map((die, dieIndex) => {
                return die.res.map((dieResult, resultIndex) => (
                  <Die 
                    key={`die-${id}-${dieIndex}-${resultIndex}`} 
                    color={die.color} 
                    value={dieResult} 
                    sides={die.die} 
                    size="tiny"
                  />
                ))
              })}
            </div>
          </LeftPart>
          <RightPart>
            <HistoryDate>
              {toTimeString(roll.time)}
            </HistoryDate>
            <LinkButton>
              <Link 
                id={`historyLink${id}`}
                to={`/roll/${roomName}/${roll.id}`} 
                target="_blank"
                style={{ textDecoration: 'none' }}
              >🔗</Link>
            </LinkButton>
          </RightPart>
        </HistoryLine>
      ))}
      {history.length === 0 ? <div>&nbsp;{lang('no_rolls')}</div> : <></>}
    </HistoryTableContainer>
  );
}