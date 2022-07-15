import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useStore } from 'react-redux';
import styled from 'styled-components';
import * as actions from '../../redux/room/actions';
import { L18N_NAMESPACE } from '../../utils/constans';
import { toast } from 'react-toastify';
import DiceSetEditor from '../Dice/DiceSetEditor';

const RoomLoginContainer = styled.div`
  padding: 20px;
  margin: 100px auto 0 auto;
  width: 100%;
  max-width: 600px;
  text-align: left;
`;
const Title = styled.h3`
`;
const PanelsContainer = styled.div`
  margin: 0 auto;
  width: 100%;
`;
const CredentialsPanel = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-right: 50px;
  max-width: 270px;
`;
const Input = styled.input`
  padding: 8px;
  margin: 3px 0 10px 0;
  width: 180px;
`;
const InputContainer = styled.div`
  min-height: 100px;
`;
const Label = styled.label`
  font-size: 0.9rem;
  color: #5a5a5a;
`;
const LogInButton = styled.button`
  padding: 10px 20px;
  display: block;
  margin: 15px 0;
  text-transform: uppercase;
  cursor: pointer;
  width: 200px;
`;
const DiceBagPanel = styled.div`
  display: inline-block;
  vertical-align: top;
  max-width: 295px;
  text-align: left;
`;

export default function RoomLogIn({ roomId, needPassword }) {

  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selected, setSelected] = useState([]);
  const [currentColor, setCurrentColor] = useState('');

  const userParams = useStore(store => store.room.userParams);

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
    dispatch(actions.setUserParams({ 
      ...userParams, 
      dice: selected, 
      color: selected.length ? undefined : currentColor
    }));
  };

  return (
    <RoomLoginContainer>
      <PanelsContainer>
        <CredentialsPanel>
          <Title>{lang('private_room')}</Title>
          <Label of="charname">{lang('char_name')}</Label>
          <InputContainer>
            <Input type="text" id="charname" value={username} onChange={handleUsernameChange} />
            {needPassword ? 
              <div>
                <Label of="password">{lang('room_password')}</Label>
                <Input type="password" id="password" value={password} onChange={handlePasswordChange} />
              </div> : <></>
            }
          </InputContainer>
          <LogInButton 
            id="enterRoom"
            onClick={handleLogIn} 
            disabled={username === '' || (needPassword && password === '')}
          >{lang('enter')}</LogInButton>
        </CredentialsPanel>
        <DiceBagPanel>
          <Title>{lang('dice_set')}</Title>
          <DiceSetEditor
            dice={selected} 
            onUpdate={setSelected}
            onColorChange={setCurrentColor}
          />
        </DiceBagPanel>
      </PanelsContainer>
    </RoomLoginContainer>
  );
}
