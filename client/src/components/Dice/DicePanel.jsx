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
  if (props.fromParams && userParams !== null && 
    userParams.dice && userParams.dice.length > 0) {
      diceOptions = userParams.dice;
  } else {
    diceOptions = ALL_DICE.map(die => ({ die, color: props.diceColor }));
  }

  const handleSelectDie = (die) => {
    if (props.disabled) return;
    if (die.die === CUSTOM_DIE) {
      props.onCustomToggle(true);
      return;
    }
    props.onCustomToggle(false);
    props.onDieSelected(die.die, die.color);
  };

  return (
    <DiceContainer disabled={props.disabled}>
      {diceOptions.map((die, id) => (
        <DieButton 
          id={`die${die.die}`} 
          key={`${die.id}-${die.die}${die.color}`} 
          onClick={handleSelectDie.bind(null, die)}
        >
          <Die sides={die.die} value={die.die} color={die.color} size={props.size || "small"} />
        </DieButton>
      ))}
    </DiceContainer>
  );
}
