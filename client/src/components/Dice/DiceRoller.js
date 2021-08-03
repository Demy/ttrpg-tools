import React from 'react';
import styled from 'styled-components';
import DicePanel from './DicePanel';
import ParametersPanel from './DieParametersPanel';
import SelectedDicePanel from './SelectedDicePanel';
import RollResultPanel from './RollResultPanel';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/Roll/actions';

const PanelsContainer = styled.div`
  width: 70%;
  display: inline-block;
  vertical-align: top;
  max-width: 600px;
  text-align: left;
`;

const DicePanelContainer = styled.div`
  border: 1px solid #c0c0c0;
  width: 100%;
`;

const ParametersContainer = styled.div`
  border: 1px solid #c0c0c0;
  width: 30%;
  max-width: 200px;
  display: inline-block;
  vertical-align: top;
`;

const MAX_DICE = 100;

export default function DiceRoller() {

  const [diceColor, setDiceColor] = React.useState('#ffffff');
  const [selectedDice, setSelectedDice] = React.useState([]);
  const [isCustomSelected, setCustomSelected] = React.useState(false);

  const dispatch = useDispatch()

  const addDie = (sides, color) => {
    if (selectedDice.length < MAX_DICE) {
      const existingIndex = selectedDice.findIndex(die => die.die === sides && die.color === color);
      if (existingIndex < 0) {
        setSelectedDice(selectedDice.concat([{
          die: sides, 
          color: color ? color : diceColor, 
          count: 1 
        }]));
      } else {
        const existing = selectedDice[existingIndex];
        const dice = selectedDice.concat();
        dice[existingIndex] = { ...existing, count: existing.count + 1 };
        setSelectedDice(dice);
      }
    }
    setCustomSelected(false);
  };

  const handleRollDice = (dice) => {
    dispatch(actions.rollDice(dice));
  };

  return (
    <div className="dice-roller">
      <PanelsContainer>
        <DicePanelContainer>
          <DicePanel 
            diceColor={diceColor} 
            onDieSelected={addDie} 
            onCustomToggle={setCustomSelected} 
          />
        </DicePanelContainer>
        <DicePanelContainer>
          <SelectedDicePanel 
            selected={selectedDice} 
            diceColor={diceColor} 
            max={MAX_DICE}
            onUpdate={setSelectedDice} 
            onRoll={handleRollDice} />
        </DicePanelContainer>
        <h3>Result:</h3>
        <DicePanelContainer>
          <RollResultPanel
            onRoll={handleRollDice}
          />
        </DicePanelContainer>
      </PanelsContainer>
      <ParametersContainer>
        <ParametersPanel 
          diceColor={diceColor} 
          showSidesSetting={isCustomSelected} 
          onColorSelected={setDiceColor}
          onAddDie={addDie} 
          onCustomCanceled={setCustomSelected.bind(null, false)}
        />
      </ParametersContainer>
    </div>
  );
}