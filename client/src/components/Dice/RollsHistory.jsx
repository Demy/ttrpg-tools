import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as actions from '../../redux/Roll/actions';
import Die from './Die';

const HistoryTableContainer = styled.div`
  text-align: left;
  padding: 5px 0;
`;
const HistoryLine = styled.div`
  &:nth-child(even) {
    background: #f5f5f5;
  }
  padding: 5px 10px;
`;
const TopLine = styled.div`
  position: relative;
`;
const HistoryDate = styled.div`
  padding: 2px 0;
  font-size: 10px;
  position: absolute;
  right: 0;
  top: 0;
  color: #585858;
`;
const HistoryLabel = styled.div`
  padding: 0 0 2px 0;
  font-size: 12px;
`;
const BottomLine = styled.div`

`;
const DiceView = styled.div`
  display: inline-block;
  width: calc(100% - 40px);
`;
const LinkButton = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  margin-left: 5px;
  vertical-align: top;
  cursor: pointer;
`;

const addZero = (num) => {
  return num < 10 ? `0${num}` : num.toString();
};
const toTimeString = (time) => {
  return `${addZero(time.getHours())}:${addZero(time.getMinutes())}:${addZero(time.getSeconds())}`;
};

export default function RollsHistory() {

  const history = useSelector(state => state.roll.history);

  const dispatch = useDispatch();

  useEffect(() => {
    if (dispatch && !history) {
      dispatch(actions.loadRollsHistory());
    }
  }, [dispatch, history]);

  if (!history) return <></>;

  return (
    <HistoryTableContainer>
      {history.map((roll, id) => (
        <HistoryLine key={`history-roll-${id}`}>
          <TopLine>
            {roll.text ? <HistoryLabel>{roll.text}:</HistoryLabel> : <></>}
            <HistoryDate>
              {toTimeString(roll.time)}
            </HistoryDate>
          </TopLine>
          <BottomLine>
            <DiceView>
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
            </DiceView>
            <a href={`/roll/${roll.id}`}><LinkButton>🔗</LinkButton></a>
          </BottomLine>
        </HistoryLine>
      ))}
      {history.length === 0 ? <div>&nbsp;No rolls done yet</div> : <></>}
    </HistoryTableContainer>
  );
}