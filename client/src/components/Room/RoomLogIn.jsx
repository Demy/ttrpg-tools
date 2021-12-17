import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as actions from '../../redux/room/actions';
import { L18N_NAMESPACE } from '../../utils/constans';
import { toast } from 'react-toastify';

const RoomLoginContainer = styled.div`
  padding: 20px;
  margin: 15% auto 0 auto;
  width: 100%;
  max-width: 270px;
  text-align: left;
`;
const Title = styled.h3`
  width: 100%;
  text-align: center;
`;
const Input = styled.input`
  padding: 8px;
  margin: 3px 0 10px 0;
  width: calc(100% - 18px);
`;
const Label = styled.label`
  font-size: 0.9rem;
  color: #5a5a5a;
`;
const LogInButton = styled.button`
  padding: 10px 20px;
  display: block;
  margin: 15px auto;
  text-transform: uppercase;
  cursor: pointer;
  width: 100%;
`;

export default function RoomLogIn({ roomId, needPassword }) {

  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [lang] = useTranslation(L18N_NAMESPACE);

  const dispatch = useDispatch();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleLogIn = () => {
    if (needPassword) {
      dispatch(actions.logInToRoom(roomId, username, password, error => {
        toast.error(lang('incorrect_password'), {
          position: toast.POSITION.TOP_RIGHT,
          toastId: 'error',
          autoClose: 2000,
          hideProgressBar: true,
        });
      }));
    } else {
      dispatch(actions.setUser(username));
    }
  };

  return (
    <RoomLoginContainer>
      <Title>{lang('private_room')}:</Title>
      <Label of="charname">{lang('char_name')}</Label>
      <Input type="text" id="charname" value={username} onChange={handleUsernameChange} />
      {needPassword ? 
        <div>
          <Label of="password">{lang('room_password')}</Label>
          <Input type="password" id="password" value={password} onChange={handlePasswordChange} />
        </div> : <></>
      }
      <LogInButton 
        id="enterRoom"
        onClick={handleLogIn} 
        disabled={username === '' || (needPassword && password === '')}
      >{lang('enter')}</LogInButton>
    </RoomLoginContainer>
  );
}
