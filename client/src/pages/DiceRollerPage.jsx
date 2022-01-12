import React from 'react';
import DiceRoller from '../components/Dice/DiceRoller';
import styled from 'styled-components';
import SocketControlledView from '../components/UI/SocketControlledView';
import { PUBLIC_ROOM } from '../utils/constans';

const DiceRollerContainer = styled.div`
  width: 100%;
  margin-top: 20px;
`;

export default function DiceRollerPage() {

  return (
    <SocketControlledView>
      <DiceRollerContainer>
        <DiceRoller roomId={PUBLIC_ROOM} />
      </DiceRollerContainer>
    </SocketControlledView>
  );
}