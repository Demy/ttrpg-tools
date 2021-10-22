import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as actions from '../../redux/room/actions';

const RoomLoginContainer = styled.div`
  padding: 20px;
  margin: 20% auto 0 auto;
  width: 100%;
  max-width: 270px;
`;
const Password = styled.input`
  padding: 8px 14px;
  width: calc(100% - 32px);
`;
const LogInButton = styled.button`
  padding: 10px 20px;
  display: block;
  margin: 15px auto;
  text-transform: uppercase;
  cursor: pointer;
  width: 100%;
`;

export default function RoomLogIn({ roomId }) {

  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogIn = () => {
    dispatch(actions.logInToRoom(roomId, password));
  };

  return (
    <RoomLoginContainer>
      <h3>Please enter room password:</h3>
      <Password type="password" value={password} onChange={handleChangePassword} />
      <LogInButton onClick={handleLogIn} disabled={password === ''}>Enter</LogInButton>
    </RoomLoginContainer>
  );
}