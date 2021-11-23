import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { L18N_NAMESPACE } from '../../utils/constans';
import DiceRoller from '../Dice/DiceRoller';
import ChangeNameDialog from './ChangeNameDialog';

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
const EditButton = styled.button`
  user-select: none;
  cursor: pointer;
  font-size: 0.9em;
  padding: 0.1em;
  background: none;
  border: none;
  color: #a5a5a5;
  font-weight: bold;
  &:hover {
    color: #000000;
  }
`;

export default function RoomView({ roomId }) {

  const [showNameEdit, setShowNameEdit] = useState(false);
  
  const username = useSelector(state => state.room.username);

  const [lang] = useTranslation(L18N_NAMESPACE);

  const handleEditName = () => {
    setShowNameEdit(true);
  };

  const handleCancel = () => {
    setShowNameEdit(false);
  };

  return (
    <ViewContainer>
      <Title>{lang('private_room')} 
        <UserName>[{username}
          <EditButton onClick={handleEditName}>🖉</EditButton>
        ]</UserName>
      </Title>
      <ChangeNameDialog 
        show={showNameEdit} 
        hide={handleCancel} 
        value={username}
      />
      <DiceRoller roomId={roomId} />
    </ViewContainer>
  );
}