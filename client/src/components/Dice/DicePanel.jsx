import React from 'react';
import Die from './Die';
import styled from 'styled-components';

const DiceContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  padding: 11px 0;
  text-align: center;
  width: 100%;
`;
const DieButton = styled.div`
  cursor: pointer;
  display: inline-block;
`;

const CUSTOM_DIE = '?';

export default function DicePanel(props) {

  const diceOptions = [4, 6, 8, 10, 12, 20, CUSTOM_DIE];

  const handleSelectDie = (die) => {
    if (die === CUSTOM_DIE) {
      props.onCustomToggle(true);
      return;
    }
    props.onCustomToggle(false);
    props.onDieSelected(die, props.diceColor);
  };

  return (
    <DiceContainer>
      {diceOptions.map(die => (
        <DieButton key={`die${die}`} onClick={handleSelectDie.bind(null, die)}>
          <Die sides={die} value={die} color={props.diceColor} size="small" />
        </DieButton>
      ))}
    </DiceContainer>
  );
}