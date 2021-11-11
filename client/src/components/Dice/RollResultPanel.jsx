import React, { useEffect, useRef, useState } from 'react';
import Die from './Die';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';  
import { toast } from 'react-toastify';
import * as actions from '../../redux/room/actions';
import { useTranslation } from 'react-i18next';
import { L18N_NAMESPACE, MOBILE_SCREEN } from '../../utils/constans';
import PCView from '../UI/PCView';
import MobileView from '../UI/MobileView';

const DiceContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 100%;
`;
const TopPanel = styled.div`
  width: 100%;
  @media (min-width: ${MOBILE_SCREEN}) {
    display: flex;
    flex-direction: row;
  }
`;
const RollLink = styled.input`
  display: block;
  width: calc(100% - 44px);
  @media (min-width: ${MOBILE_SCREEN}) {
    display: inline-block;
    vertical-align: middle;
    flex: 1;
  }
  padding: 7px;
  margin: 15px;
`;
const ButtonsPanel = styled.div`
  flex-direction: row;
  display: flex;
  width: 100%;
  @media (min-width: ${MOBILE_SCREEN}) {
    display: inline-block;
    vertical-align: top;
  }
`;
const ReRollButton = styled.button`
  display: inline-block;
  vertical-align: middle;
  float: right;
  padding: 12px 24px;
  margin: 10px 15px;
  flex: 1;
  @media (min-width: ${MOBILE_SCREEN}) {
    margin: 10px 10px 10px 0;
    flex; none;
  }
  cursor: pointer;
  text-transform: uppercase;
`;
const ClearButton = styled.button`
  float: right;
  padding: 10px 14px;
  margin: 10px 15px 10px 0;
  @media (min-width: ${MOBILE_SCREEN}) {
    margin: 13px 10px 13px 0;
  }
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
  return window.location.origin;
}

export default function RollResultPanel(props) {

  const lastRoll = useSelector(state => state.room.lastRoll);
  const roomName = useSelector(state => state.room.roomName);

  const [canCopy, setCanCopy] = useState(true);

  const dispatch = useDispatch();

  const ref = useRef(null);

  const [lang] = useTranslation(L18N_NAMESPACE);

  const link = lastRoll.id > 0 ? `${getBaseUrl()}/roll/${roomName}/${lastRoll.id}` : '';

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
    const selected = lastRoll.res.map(die => ({
      die: die.die,
      color: die.color,
      count: die.count
    }));
    props.onRoll(selected, lastRoll.text ? `${lang('reroll')}: ${lastRoll.text}` : '');
  };

  const handleFocus = (event) => {
    if (!canCopy) return;
    event.target.select();
    event.target.setSelectionRange(0, 99999);

    document.execCommand("copy");

    setCanCopy(false);

    toast.info(lang('link_copied'), {
      position: toast.POSITION.TOP_RIGHT,
      toastId: 'link_copied',
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  const handleChange = () => {};

  const handleClear = () => {
    dispatch(actions.clearLastRoll());
  };

  const buttons = <ButtonsPanel>
    <ReRollButton 
      disabled={lastRoll.id < 0} 
      onClick={handleReroll}
    >
      {lang('reroll')}
    </ReRollButton>
    <ClearButton
      disabled={lastRoll.id < 0} 
      onClick={handleClear}
    >
      {lang('clear')}
    </ClearButton>
  </ButtonsPanel>

  return (
    <DiceContainer ref={ref}>
      <TopPanel>
        <RollLink 
          disabled={lastRoll.id < 0}
          type="text"
          value={link} 
          onFocus={handleFocus}
          onBlur={setCanCopy.bind(null, true)}
          onChange={handleChange}
        />
        <PCView>
          {buttons}
        </PCView>
      </TopPanel>
      <MobileView>
        {buttons}
      </MobileView>
      <Dice>
        {lastRoll.res.map((die, i) => addDiceFrom(die, `selected${i}`))}
      </Dice>
    </DiceContainer>
  );
}