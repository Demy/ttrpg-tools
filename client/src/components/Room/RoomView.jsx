import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

export default function RoomView() {

  const roomName = useSelector(state => state.room.roomName);

  return (
    <div>
      Room: {roomName}
    </div>
  );
}