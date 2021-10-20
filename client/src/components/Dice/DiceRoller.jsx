import React, { useEffect } from 'react';
import styled from 'styled-components';
import DicePanel from './DicePanel';
import ParametersPanel from './DieParametersPanel';
import SelectedDicePanel from './SelectedDicePanel';
import RollResultPanel from './RollResultPanel';
import RollsHistory from './RollsHistory';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/room/actions';
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
const ResultContainer = styled.div`
  opacity: ${props => props.active ? 1 : 0.5};
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

const MAX_DICE = 20;
const MAX_TEXT_LENGTH = 100;

const joinPublicRoom = (socket) => {
  socket.emit('joinPublicRoom');
};

const trimLength = (text) => {
  if (text && text.length > MAX_TEXT_LENGTH) {
    return text.substring(0, MAX_TEXT_LENGTH - 3) + '...';
  }
  return text;
};

export default function DiceRoller() {

  const [diceColor, setDiceColor] = React.useState('#ffffff');
  const [selectedDice, setSelectedDice] = React.useState([]);
  const [isCustomSelected, setCustomSelected] = React.useState(false);

  const lastRoll = useSelector(state => state.room.lastRoll);
  const room = useSelector(state => state.room.roomName);
  const socket = useSelector(state => state.room.socket);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!!dispatch && room === '' && !!socket) {
      dispatch(actions.moveToPublicRoom());
      socket.on('roll', data => {
        dispatch(actions.addNewRoll(data));
      });
      if (socket.connected) {
        joinPublicRoom(socket);
      } else {
        socket.on('connect', () => {
          joinPublicRoom(socket);
        });
      }
      socket.on('reconnect', () => {
        joinPublicRoom(socket);
      });
    
    }
  }, [dispatch, room, socket]);

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
    if (socket) {
      const uid = uuid();
      socket.emit('roll', { dice, text: trimLength(text), uid });
      dispatch(actions.setLastRollId(uid));
    }
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
        <ResultContainer active={lastRoll && lastRoll.id >= 0}>
          <h3>Result: {lastRoll.text ? lastRoll.text : ''}</h3>
          <DicePanelContainer>
            <RollResultPanel
              onRoll={handleRollDice}
            />
          </DicePanelContainer>
        </ResultContainer>
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