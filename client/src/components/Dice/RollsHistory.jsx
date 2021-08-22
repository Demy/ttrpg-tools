import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/Roll/actions';
import Die from './Die';

export default function RollsHistory() {

  const history = useSelector(state => state.roll.history);

  console.log(history);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(history);
    if (dispatch && !history) {
      dispatch(actions.loadRollsHistory());
    }
  }, [dispatch, history]);

  if (!history) return <></>;

  return (
    <div>
      {history.map((roll, id) => (
        <div key={`history-roll-${id}`}>
          <div>{roll.text}</div>
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
      ))}
    </div>
  );
}