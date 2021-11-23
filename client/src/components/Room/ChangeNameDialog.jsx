import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { L18N_NAMESPACE } from '../../utils/constans';
import PopupWindow from '../UI/PopupWindow';
import * as actions from '../../redux/room/actions';  
import { toast } from 'react-toastify';

const FormContainer = styled.div`
  margin: 0 auto;
`;
const Title = styled.h3`
  margin: 0;
`;
const Input = styled.input`
  padding: 7px;
  margin: 14px 0;
  display: block;
  width: calc(100% - 14px);
  text-align: center;
`;
const CancelButton = styled.button`
  cursor: pointer;
  padding: 7px 14px;
  width: calc(50% - 7px);
  margin-right: 14px;
`;
const OkButton = styled.button`
  cursor: pointer;
  padding: 7px 14px;
  width: calc(50% - 7px);
`;

export default function ChangeNameDialog(props) {

  const [newName, setNewName] = useState(props.value);

  const [lang] = useTranslation(L18N_NAMESPACE);

  const dispatch = useDispatch();

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSaveName = () => {
    if (newName === '') {
      toast.info(lang('enter_name'), {
        position: toast.POSITION.TOP_RIGHT,
        toastId: 'enter_name',
        autoClose: 2000,
        hideProgressBar: true,
      });
      return;
    }
    dispatch(actions.setUser(newName));
    props.hide();
  };

  return (
    <PopupWindow
      show={props.show} 
      hide={props.hide}
      width={250}
    >
      <FormContainer>
        <Title>{lang('change_name')}</Title>
        <Input type="text" value={newName} onChange={handleNameChange} />
        <CancelButton onClick={props.hide}>{lang('cancel')}</CancelButton>
        <OkButton onClick={handleSaveName}>{lang('save')}</OkButton>
      </FormContainer>
    </PopupWindow>
  );
}