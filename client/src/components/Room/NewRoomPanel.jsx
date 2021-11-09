import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import ToggleSwitch from '../UI/ToggleSwitch';
import { toast } from 'react-toastify';
import uuid from 'react-uuid';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { L18N_NAMESPACE } from '../../utils/constans';

const RoomPanelContainer = styled.div`
  width: 100%;
  text-align: left;
  max-width: 880px;
  margin: 20px auto;
  padding: 10px 15px;
  border: 1px solid #c0c0c0;
`;
const Title = styled.h3`
  margin: 0.4em 0;
`;
const PanelPartsContainer = styled.div`
  wdth: 100%;
`;
const DescriptionPart = styled.div`
  width: 70%;
  display: inline-block;
  vertical-align: top;
`;
const FormPart = styled.div`
  vertical-align: top;
  display: inline-block;
`;
const Description = styled.p`
  font-size: 1em;
  margin: 5px 0 10px 0;
  padding-right: 20px;
`;
const CreateButton = styled.button`
  padding: 10px 20px;
  margin: 5px 10px 5px 0;
  cursor: pointer;
  width: 110px;
  display: block;
`;
const PasswordInput = styled.input`
`;

const showError = (text, id) => {
  toast.error(text, {
    position: toast.POSITION.TOP_RIGHT,
    toastId: id,
    autoClose: 3000,
    hideProgressBar: true,
  });
};

export default function RoomPanel() {

  const [isPrivate, setPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [areRollsPrivate, setRollsPrivate] = useState(false);

  const socket = useSelector(state => state.room.socket);

  const history = useHistory();

  const [lang] = useTranslation(L18N_NAMESPACE);

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleCreate = () => {
    if (isPrivate && !password) {
      showError(lang('enter_password'), 'password');
      return;
    }
    const roomId = uuid();
    if (socket) {
      socket.on('room', (createdRoomId) => {
        if (roomId === createdRoomId) {
          history.push('/room/' + roomId);
        }
      });
      
      socket.emit('createRoom', { 
        roomId, 
        private: isPrivate ? 1 : 0, 
        password: isPrivate ? password : '', 
        protected: isPrivate && areRollsPrivate ? 1 : 0 
      });
    } else {
      showError(lang('no_connection'), 'socket');
    }
  };

  return (
    <RoomPanelContainer>
      <Title>{lang('create_room')}</Title>
      <PanelPartsContainer>
        <DescriptionPart>
          <Description>
            {lang('create_room_descr_1')}
          </Description>
          <Description>
            {lang('create_room_descr_2')}
          </Description>
          <Description>
            {lang('create_room_descr_3')}
          </Description>
        </DescriptionPart>
        <FormPart>
          <ToggleSwitch label={lang('use_password')} value={isPrivate} onChange={setPrivate} />
          {isPrivate ? (
            <div>
              <div>
                <PasswordInput type="text" value={password} onChange={handleChangePassword} />
              </div>
              <div>
                <ToggleSwitch 
                  label={lang('protect_links')} 
                  value={areRollsPrivate} 
                  onChange={setRollsPrivate} 
                />
              </div>
            </div>
          ) : <></>}
          <CreateButton onClick={handleCreate}>{lang('create')}</CreateButton>
        </FormPart>
      </PanelPartsContainer>
    </RoomPanelContainer>
  );
}