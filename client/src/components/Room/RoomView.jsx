import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { L18N_NAMESPACE } from '../../utils/constans';
import DiceRoller from '../Dice/DiceRoller';

const ViewContainer = styled.div`
  padding: 0 10px 10px 10px;
  margin: 0 auto;
`;
const Title = styled.h3``;
const UserName = styled.span`
  color: #a5a5a5;
  font-size: 0.8em;
  padding: 0.4em;
`;
const EditButton = styled.span`
  user-select: none;
  cursor: pointer;
  font-size: 0.9em;
  padding: 0.1em;
  &:hover {
    color: #000000;
  }
`;

export default function RoomView({ roomId }) {
  
  const username = useSelector(state => state.room.username);

  const [lang] = useTranslation(L18N_NAMESPACE);

  return (
    <ViewContainer>
      <Title>{lang('private_room')} 
        <UserName>[{username}<EditButton>🖉</EditButton>]</UserName>
      </Title>
      <DiceRoller roomId={roomId} />
    </ViewContainer>
  );
}