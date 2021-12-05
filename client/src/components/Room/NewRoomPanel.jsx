import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import ToggleSwitch from '../UI/ToggleSwitch';
import { toast } from 'react-toastify';
import uuid from 'react-uuid';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { L18N_NAMESPACE, MOBILE_SCREEN } from '../../utils/constans';
import * as actions from '../../redux/room/actions';

const RoomPanelContainer = styled.div`
  text-align: left;
  max-width: ${MOBILE_SCREEN};
  margin: 20px auto;
  border: 1px solid #c0c0c0;
  width: calc(100% - 30px);
  @media (min-width: ${MOBILE_SCREEN}) {
    width: 100%;
  }
`;
const Title = styled.h3`
  padding: 10px 15px 0 15px;
  margin: 0.4em 0;
  display: none;
  @media (min-width: ${MOBILE_SCREEN}) {
    display: block;
  }
`;
const MobileTitle = styled.div`
  background-color: #f5f5f5;
  border-bottom: 1px solid #898989;
  padding: 10px 15px;
  &:after {
    content: '+';
    font-size: 18px;
    font-weight: bold;
    color: #898989;
    float: right;
    margin-top: -2px;
    width: 18px;
    text-align: center;
  }
  ${props => props.open ? `
    &:after {
      content: '-';
    }
  ` : ''}
  @media (min-width: ${MOBILE_SCREEN}) {
    display: none;
  }
`;
const PanelPartsContainer = styled.div`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  ${props => props.open ? `
    max-height: initial;
  ` : ''}
  @media (min-width: ${MOBILE_SCREEN}) {
    overflow: auto;
    max-height: initial;
  }
  wdth: 100%;
`;
const DescriptionPart = styled.div`
  width: auto;
  padding: 10px 15px 0 15px;
  @media (min-width: ${MOBILE_SCREEN}) {
    width: calc(70% - 30px);
    padding: 10px 15px;
  }
  display: inline-block;
  vertical-align: top;
`;
const FormPart = styled.div`
  padding: 0 15px 15px 15px;
  @media (min-width: ${MOBILE_SCREEN}) {
    width: calc(30% - 15px);
    margin: 10px 15px 10px 0;
    padding: 0;
  }
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
  const [isOpen, setOpen] = useState(false);

  const socket = useSelector(state => state.room.socket);

  const history = useHistory();
  const dispatch = useDispatch();

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
          dispatch(actions.clearHistory());
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
      <MobileTitle open={isOpen} onClick={setOpen.bind(null, !isOpen)}>
        {lang('create_room')}
      </MobileTitle>
      <PanelPartsContainer open={isOpen}>
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
          <ToggleSwitch 
            id="usePassword"
            label={lang('use_password')} 
            value={isPrivate} 
            onChange={setPrivate} 
          />
          {isPrivate ? (
            <div>
              <div>
                <PasswordInput 
                  id="newRoomPass"
                  type="text" 
                  value={password} 
                  onChange={handleChangePassword} 
                />
              </div>
              <div>
                <ToggleSwitch 
                  id="protectRolls"
                  label={lang('protect_links')} 
                  value={areRollsPrivate} 
                  onChange={setRollsPrivate} 
                />
              </div>
            </div>
          ) : <></>}
          <CreateButton id="createRoom" onClick={handleCreate}>
            {lang('create')}
          </CreateButton>
        </FormPart>
      </PanelPartsContainer>
    </RoomPanelContainer>
  );
}