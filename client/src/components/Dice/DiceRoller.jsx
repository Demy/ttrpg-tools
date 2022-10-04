import React, { useCallback, useEffect, useState } from 'react';
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
import { L18N_NAMESPACE, MOBILE_SCREEN, PUBLIC_ROOM } from '../../utils/constans';
import devLog from '../../helpers/logger';
import EditDicePanel from './EditDicePanel';

const RollerContainer = styled.div`
  max-width: 915px;
  margin: 0 auto;
  
  @media (min-width: ${MOBILE_SCREEN}) {
    && > :nth-child(2n + 1) { order: 1; }
    && > :nth-child(2n + 2) { order: 2; }
    && > :nth-child(-n + 2) {
      page-break-before: always;
      break-before: always;
    }
  }
`;
const MainContentContainer = styled.div`
  text-align: left;
  margin: 15px;

  @media (min-width: ${MOBILE_SCREEN}) {
    display: flex;
    justify-content: center;
    align-items: center;

    min-width: 70%;
    padding: 0;
    margin: 0;
    display: inline-block;
    vertical-align: top;
    max-width: 600px;
  }
`;
const SideContentContainer = styled.div`
  margin: 15px;

  @media (min-width: ${MOBILE_SCREEN}) {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 0;
    margin: 0;
    margin-left: 10px;
    min-width: calc(30% - 10px);
    display: inline-block;
    vertical-align: top;
    max-width: 264px;
  }
`;
const DicePanelContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.secondaryLight};
  width: 100%;
  background-color: ${props => props.theme.colors.secondary};
`;
const ResultContainer = styled.div`
  opacity: ${props => props.active ? 1 : 0.5};
`;
const ParametersContainer = styled.div`
  padding: 13px 15px;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textAccent};
`;

const HistoryPanelContainer = styled.div`
  border: 1px solid #c0c0c0;
  max-height: 394px;
  overflow: auto;
  margin: 10px auto;
  background-color: ${props => props.theme.colors.primaryLight};
`;
const HistoryTitle = styled.h3`
  width: 100%;
  margin: 15px 10px;
  text-align: left;
`;
const SmallTitle = styled.h4`
  margin: 0;
  padding: 0 0 7px 0;
  tex-align: left;
`;

const MAX_DICE = 20;
const MAX_TEXT_LENGTH = 100;

const trimLength = (text) => {
  if (text && text.length > MAX_TEXT_LENGTH) {
    return text.substring(0, MAX_TEXT_LENGTH - 3) + '...';
  }
  return text;
};

export default function DiceRoller({ roomId, isPublic }) {

  const userParams = useSelector(state => state.room.userParams);

  const [diceColor, setDiceColor] = useState(userParams?.color || '#ffffff');
  const [currentRoom, setCurrentRoom] = useState('');
  const [selectedDice, setSelectedDice] = useState([]);
  const [isCustomSelected, setCustomSelected] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [lang] = useTranslation(L18N_NAMESPACE);

  const lastRoll = useSelector(state => state.room.lastRoll);
  const roomName = useSelector(state => state.room.roomName);
  const username = useSelector(state => state.room.username);
  const socket = useSelector(state => state.room.socket);

  const dispatch = useDispatch();

  useEffect(() => {
    if (roomId !== currentRoom && !!socket) {
      const oldRoomName = roomName;
      const joinRoom = () => {
        devLog(`${oldRoomName ? `Leave ${oldRoomName} -> ` : ''}Join ${roomId}`);
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
        setLoading(false);
        dispatch(actions.addNewRoll(data));
      });

      setCurrentRoom(roomId);
    }
  }, [currentRoom, dispatch, roomId, roomName, socket]);

  useEffect(() => {
    if (roomId === PUBLIC_ROOM && username !== '') {
      dispatch(actions.setVerified(false));
      dispatch(actions.setUser(''));
      dispatch(actions.setUserParams(null));
    }
  });

  const addDie = useCallback((sides, color) => {
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
  }, [diceColor, selectedDice]);

  const handleRollDice = useCallback((dice, text) => {
    setLoading(true);
    socket.executeWhenConnected(() => {
      const uid = uuid();
      let fullText = `${username ? username : ''}${username && text ? ': ' : ''}${text}`;
      socket.emit('roll', { dice, text: trimLength(fullText), uid });
      dispatch(actions.setLastRollId(uid));
    });
  }, [dispatch, socket, username]);

  const sidePanel = userParams && userParams.dice && userParams.dice.length > 0 ? (
    <ParametersContainer>
      <SmallTitle>{lang('dice_set')}</SmallTitle>
      <EditDicePanel 
        dice={userParams.dice}
      />
    </ParametersContainer>
  ) : (
    <ParametersContainer>
      <SmallTitle>{lang('parameters')}</SmallTitle>
      <ParametersPanel 
        diceColor={diceColor} 
        showSidesSetting={isCustomSelected} 
        onColorSelected={setDiceColor}
        onAddDie={addDie} 
        onCustomCanceled={setCustomSelected.bind(null, false)}
      />
    </ParametersContainer>
  );

  return (
    <RollerContainer>
      <MainContentContainer>
        <DicePanelContainer>
          <DicePanel 
            disabled={isLoading}
            fromParams={true}
            diceColor={diceColor} 
            onDieSelected={addDie} 
            onCustomToggle={setCustomSelected} 
          />
        </DicePanelContainer>
      </MainContentContainer>
      <SideContentContainer>
        {sidePanel}
      </SideContentContainer>
      <MainContentContainer>
        <DicePanelContainer>
          <SelectedDicePanel 
            disabled={isLoading}
            selected={selectedDice} 
            diceColor={diceColor} 
            max={MAX_DICE}
            onUpdate={setSelectedDice} 
            onRoll={handleRollDice} />
        </DicePanelContainer>
        <ResultContainer active={lastRoll && lastRoll.id >= 0}>
          <h3 id="resultTitle">
            {lang('result')}: {lastRoll.text ? lastRoll.text : ''}
          </h3>
          <DicePanelContainer style={isPublic ? { minHeight: '258px' } : {}}>
            <RollResultPanel
              disabled={isLoading}
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
    </RollerContainer>
  );
}