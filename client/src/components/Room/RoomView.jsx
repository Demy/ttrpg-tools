import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { L18N_NAMESPACE } from '../../utils/constans';
import DiceRoller from '../Dice/DiceRoller';
import ChangeNameDialog from './ChangeNameDialog';
import { ReactComponent as PencilIcon } from '../../assets/img/pencil.svg';

const ViewContainer = styled.div`
  padding: 0 10px 10px 10px;
  margin: 0 auto;
`;
const Title = styled.h3`
  display: inline-block;
`;
const UserNameStart = styled.span`
  color: #a5a5a5;
  font-size: 0.8em;
  padding-left: 0.4em;
  font-weight: bold;
`;
const UserNameEnd = styled.span`
  color: #a5a5a5;
  font-size: 0.8em;
  font-weight: bold;
`;
const EditButton = styled.div`
  display: inline-block;
  user-select: none;
  cursor: pointer;
  opacity: 0.5;
  width: 16px;
  height: 16px;
  transform: scale(110%);
  &:hover {
    opacity: 1;
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
      <Title>{lang('private_room')}</Title>
      <UserNameStart>
        [{username}
      </UserNameStart>
      <EditButton onClick={handleEditName}>
        <PencilIcon />
      </EditButton>
      <UserNameEnd>
      ]
      </UserNameEnd>
      <ChangeNameDialog 
        show={showNameEdit} 
        hide={handleCancel} 
        value={username}
      />
      <DiceRoller roomId={roomId} />
    </ViewContainer>
  );
}