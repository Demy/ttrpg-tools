import React, { useEffect } from 'react';
import styled from 'styled-components';
import DicePanel from './DicePanel';
import ParametersPanel from './DieParametersPanel';
import SelectedDicePanel from './SelectedDicePanel';
import RollResultPanel from './RollResultPanel';
import RollsHistory from './RollsHistory';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/Roll/actions';
import uuid from 'react-uuid';

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

const SidePanelContaner = styled.div`
  width: 30%;
  max-width: 300px;
  display: inline-block;
  vertical-align: top;
  margin-left: 10px;
`;
const ParametersContainer = styled.div`
  border: 1px solid #c0c0c0;
`;

const HistoryPanelContainer = styled.div`
  border: 1px solid #c0c0c0;
  width: 100%;
  max-height: 394px;
  overflow: auto;
  margin: 10px auto;
`;
const HistoryTitle = styled.h3`
  width: 100%;
  margin: 15px 10px;
  text-align: left;
`;

const MAX_DICE = 100;

export default function DiceRoller() {

  const [diceColor, setDiceColor] = React.useState('#ffffff');
  const [selectedDice, setSelectedDice] = React.useState([]);
  const [isCustomSelected, setCustomSelected] = React.useState(false);

  const lastRoll = useSelector(state => state.roll.lastRoll);
  const room = useSelector(state => state.roll.room);

  const dispatch = useDispatch();

  useEffect(() => {
    if (dispatch && room === '') {
      dispatch(actions.moveToPublicRoom());
    }
  }, [dispatch, room]);

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

  const handleRollDice = (dice, text) => {
    const uid = uuid();
    dispatch(actions.rollDice(dice, text, uid));
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
        <h3>Result: {lastRoll.text ? lastRoll.text : ''}</h3>
        <DicePanelContainer>
          <RollResultPanel
            onRoll={handleRollDice}
          />
        </DicePanelContainer>
      </PanelsContainer>
      <SidePanelContaner>
        <ParametersContainer>
          <ParametersPanel 
            diceColor={diceColor} 
            showSidesSetting={isCustomSelected} 
            onColorSelected={setDiceColor}
            onAddDie={addDie} 
            onCustomCanceled={setCustomSelected.bind(null, false)}
          />
        </ParametersContainer>
        <HistoryTitle>All rolls</HistoryTitle>
        <HistoryPanelContainer>
          <RollsHistory />
        </HistoryPanelContainer>
      </SidePanelContaner>
    </div>
  );
}