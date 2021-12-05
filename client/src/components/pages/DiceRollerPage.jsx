import React from 'react';
import DiceRoller from '../Dice/DiceRoller';
import styled from 'styled-components';
import SocketControlledView from '../UI/SocketControlledView';

const DiceRollerContainer = styled.div`
  width: 100%;
  margin-top: 20px;
`;

export default function DiceRollerPage() {

  return (
    <SocketControlledView>
      <DiceRollerContainer>
        <DiceRoller />
      </DiceRollerContainer>
    </SocketControlledView>
  );
}