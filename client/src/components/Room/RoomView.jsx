import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { L18N_NAMESPACE } from '../../utils/constans';
import DiceRoller from '../Dice/DiceRoller';

const ViewContainer = styled.div`
  padding: 10px;
  margin: 0 auto;
`;

export default function RoomView({ roomId }) {

  const [lang] = useTranslation(L18N_NAMESPACE);

  return (
    <ViewContainer>
      <h3>{lang('private_room')}</h3>
      <DiceRoller roomId={roomId} />
    </ViewContainer>
  );
}