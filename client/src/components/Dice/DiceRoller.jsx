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
import { useTranslation } from 'react-i18next';
import { L18N_NAMESPACE, MOBILE_SCREEN } from '../../utils/constans';

const MainContentContainer = styled.div`
  text-align: left;
  margin: 15px;
  @media (min-width: ${MOBILE_SCREEN}) {
    width: 70%;
    padding: 0;
    margin: 0;
    margin-right: 10px;
    display: inline-block;
    vertical-align: top;
    max-width: 600px;
  }
`;
const SideContentContainer = styled.div`
  margin: 15px;
  @media (min-width: ${MOBILE_SCREEN}) {
    width: calc(30% - 10px);
    padding: 0;
    margin: 0;
    display: inline-block;
    vertical-align: top;
    max-width: 300px;
  }
`;
const DicePanelContainer = styled.div`
  border: 1px solid #c0c0c0;
  width: 100%;
`;
const ResultContainer = styled.div`
  opacity: ${props => props.active ? 1 : 0.5};
`;
const ParametersContainer = styled.div`
  border: 1px solid #c0c0c0;
`;

const HistoryPanelContainer = styled.div`
  border: 1px solid #c0c0c0;
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

const trimLength = (text) => {
  if (text && text.length > MAX_TEXT_LENGTH) {
    return text.substring(0, MAX_TEXT_LENGTH - 3) + '...';
  }
  return text;
};

export default function DiceRoller({ roomId }) {

  const [diceColor, setDiceColor] = React.useState('#ffffff');
  const [currentRoom, setCurrentRoom] = React.useState('');
  const [selectedDice, setSelectedDice] = React.useState([]);
  const [isCustomSelected, setCustomSelected] = React.useState(false);

  const [lang] = useTranslation(L18N_NAMESPACE);

  const lastRoll = useSelector(state => state.room.lastRoll);
  const roomName = useSelector(state => state.room.roomName);
  const socket = useSelector(state => state.room.socket);

  const dispatch = useDispatch();

  useEffect(() => {
    if (roomId !== currentRoom && !!socket) {
      const oldRoomName = roomName;
      const joinRoom = () => {
        if (oldRoomName) {
          socket.emit('leaveRoom', oldRoomName);
        }
        socket.emit('joinRoom', roomId);;
      };
      if (socket.connected) {
        joinRoom();
      } else {
        socket.on('connect', () => {
          joinRoom();
        });
      }
      socket.on('reconnect', () => {
        joinRoom();
      });

      dispatch(actions.moveToRoom(roomId));

      socket.off('roll');
      socket.on('roll', data => {
        dispatch(actions.addNewRoll(data));
      });

      setCurrentRoom(roomId);
    }
  }, [currentRoom, dispatch, roomId, roomName, socket]);

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
      <MainContentContainer>
        <DicePanelContainer>
          <DicePanel 
            diceColor={diceColor} 
            onDieSelected={addDie} 
            onCustomToggle={setCustomSelected} 
          />
        </DicePanelContainer>
      </MainContentContainer>
      <SideContentContainer>
        <ParametersContainer>
          <ParametersPanel 
            diceColor={diceColor} 
            showSidesSetting={isCustomSelected} 
            onColorSelected={setDiceColor}
            onAddDie={addDie} 
            onCustomCanceled={setCustomSelected.bind(null, false)}
          />
        </ParametersContainer>
      </SideContentContainer>
      <MainContentContainer>
        <DicePanelContainer>
          <SelectedDicePanel 
            selected={selectedDice} 
            diceColor={diceColor} 
            max={MAX_DICE}
            onUpdate={setSelectedDice} 
            onRoll={handleRollDice} />
        </DicePanelContainer>
        <ResultContainer active={lastRoll && lastRoll.id >= 0}>
          <h3>{lang('result')}: {lastRoll.text ? lastRoll.text : ''}</h3>
          <DicePanelContainer>
            <RollResultPanel
              onRoll={handleRollDice}
            />
          </DicePanelContainer>
        </ResultContainer>
      </MainContentContainer>
      <SideContentContainer>
        <HistoryTitle>{lang('all_rolls')}</HistoryTitle>
        <HistoryPanelContainer>
          <RollsHistory />
        </HistoryPanelContainer>
      </SideContentContainer>
    </div>
  );
}