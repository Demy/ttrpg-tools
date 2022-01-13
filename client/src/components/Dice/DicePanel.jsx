import React from 'react';
import Die from './Die';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const DiceContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  padding: 11px 7px;
  text-align: center;
  width: calc(100% - 14px);
  ${props => props.disabled ? `
    opacity: 0.8;
  ` : ''}
`;
const DieButton = styled.div`
  cursor: pointer;
  display: inline-block;
`;

const CUSTOM_DIE = '?';
const ALL_DICE = [4, 6, 8, 10, 12, 20, CUSTOM_DIE];

export default function DicePanel(props) {

  const userParams = useSelector(state => state.room.userParams);

  let diceOptions = [];
  if (userParams !== null && 
    userParams.dice && userParams.dice.length > 0) {
      diceOptions = userParams.dice;
  } else {
    diceOptions = ALL_DICE.map(die => ({ die, color: props.diceColor }));
  }

  const handleSelectDie = (die) => {
    if (props.disabled) return;
    if (die === CUSTOM_DIE) {
      props.onCustomToggle(true);
      return;
    }
    props.onCustomToggle(false);
    props.onDieSelected(die, props.diceColor);
  };

  return (
    <DiceContainer disabled={props.disabled}>
      {diceOptions.map(die => (
        <DieButton 
          id={`die${die.die}`} 
          key={`die${die.die}`} 
          onClick={handleSelectDie.bind(null, die.die)}
        >
          <Die sides={die.die} value={die.die} color={die.color} size={props.size || "small"} />
        </DieButton>
      ))}
    </DiceContainer>
  );
}
