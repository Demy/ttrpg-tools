import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as actions from '../../redux/room/actions';
import { L18N_NAMESPACE } from '../../utils/constans';
import { toast } from 'react-toastify';

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

  const [lang] = useTranslation(L18N_NAMESPACE);

  const dispatch = useDispatch();

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogIn = () => {
    dispatch(actions.logInToRoom(roomId, password, error => {
			toast.error(lang('incorrect_password'), {
        position: toast.POSITION.TOP_RIGHT,
        toastId: 'error',
        autoClose: 2000,
        hideProgressBar: true,
      });
		}));
  };

  return (
    <RoomLoginContainer>
      <h3>{lang('enter_password')}:</h3>
      <Password type="password" value={password} onChange={handleChangePassword} />
      <LogInButton onClick={handleLogIn} disabled={password === ''}>{lang('enter')}</LogInButton>
    </RoomLoginContainer>
  );
}
