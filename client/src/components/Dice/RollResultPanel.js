import React, { useEffect, useRef } from 'react';
import Die from './Die';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';  
import { toast } from 'react-toastify';
import * as actions from '../../redux/Roll/actions';

const DiceContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 100%;
`;
const TopPanel = styled.div`
  width: 100%;
`;
const RollLink = styled.input`
  display: inline-block;
  vertical-align: middle;
  width: 350px;
  padding: 7px;
  margin: 15px;
`;
const RollButton = styled.button`
  display: inline-block;
  vertical-align: middle;
  float: right;
  padding: 12px 24px;
  margin: 10px 10px 10px 0;
  cursor: pointer;
  width: 110px;
`;
const ClearButton = styled.button`
  float: right;
  padding: 10px 14px;
  margin: 13px 10px 13px 0;
  cursor: pointer;
  border: none;
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

function getBaseUrl() {
  var re = new RegExp(/^.*\//);
  return re.exec(window.location.href);
}

export default function RollResultPanel(props) {

  const lastRoll = useSelector(state => state.roll.lastRoll);

  const dispatch = useDispatch();

  const ref = useRef(null);

  const link = lastRoll.id > 0 ? `${getBaseUrl()}roll/${lastRoll.id}` : '';

  useEffect(() => {
    if (lastRoll.id > 0 && ref && ref.current) {
      var scrollDiv = ref.current.offsetTop;
      window.scrollTo({ top: scrollDiv, behavior: 'smooth'});
    }
  }, [lastRoll, ref]);

  const addDiceFrom = (die, index) => {
    const result = [];
    const values = die.res;
    for (let j = 0; j < values.length; j++) {
      result.push(
        <DieContainer key={`selected${index}-${die.die}-${die.color}-${j}`} >
          <Die sides={die.die} color={die.color} value={values[j]} size="medium" />
        </DieContainer>
      );
    }
    return result;
  };

  const handleReroll = () => {
    const selected = lastRoll.roll.map(die => ({
      die: die.die,
      color: die.color,
      count: die.count
    }));
    props.onRoll(selected, lastRoll.text ? 'Re-roll: ' + lastRoll.text : '');
  };

  const handleFocus = (event) => {
    event.target.select();
    event.target.setSelectionRange(0, 99999);

    document.execCommand("copy");

    toast.info("Link copied!", {
      position: toast.POSITION.TOP_RIGHT,
      toastId: 'Link copied',
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  const handleChange = () => {};

  const handleClear = () => {
    dispatch(actions.clearLastRoll());
  };

  return (
    <DiceContainer ref={ref}>
      <TopPanel>
        <RollLink 
          disabled={lastRoll.id < 0}
          type="text"
          value={link} 
          onFocus={handleFocus}
          onChange={handleChange}
        />
        <RollButton 
          disabled={lastRoll.id < 0} 
          onClick={handleReroll}
        >
          RE-ROLL
        </RollButton>
        <ClearButton
          disabled={lastRoll.id < 0} 
          onClick={handleClear}
        >
          Clear
        </ClearButton>
      </TopPanel>
      <Dice>
        {lastRoll.roll.map((die, i) => addDiceFrom(die, `selected${i}`))}
      </Dice>
    </DiceContainer>
  );
}