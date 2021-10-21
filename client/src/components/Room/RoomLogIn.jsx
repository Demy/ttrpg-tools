import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as actions from '../../redux/room/actions';

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
    <div>
      Please enter password:
      <input type="password" value={password} onChange={handleChangePassword} />
      <button onClick={handleLogIn} disabled={password === ''}>Enter</button>
    </div>
  );
}
