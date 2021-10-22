import React from 'react';
import styled from 'styled-components';
import DiceRoller from '../Dice/DiceRoller';

const ViewContainer = styled.div`
  padding: 10px;
  margin: 0 auto;
`;

export default function RoomView({ roomId }) {

  return (
    <ViewContainer>
      <h3>Private room</h3>
      <DiceRoller roomId={roomId} />
    </ViewContainer>
  );
}