import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { COOKIES_PARAMS, COOKIES_USER_PARAMS_PREFIX, L18N_NAMESPACE } from '../../utils/constans';
import DiceSetEditor from './DiceSetEditor';
import * as actions from '../../redux/room/actions';
import { useDispatch, useStore } from 'react-redux';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

const DiceSetPanel = styled.div`
  text-align: left;
  width: 100%;
`;
const EditButtonConatiner = styled.div`
  text-align: center;
  width: 100%;
`;
const EditButton = styled.button`
  padding: 5px 14px;
  margin: 1px auto;
  cursor: pointer;
`;
const EditViewCintainer = styled.div`
`;
const SaveButton = styled.button`
  padding: 5px 14px;
  margin-right: 10px;
  cursor: pointer;
  margin-bottom: 5px;
`;
const CancelButton = styled.button`
  padding: 5px 14px;
  cursor: pointer;
  margin-bottom: 5px;
`;

export default function EditDicePanel({ dice }) {
  
  const [isInEditMode, setInEditMode] = useState(false);
  const [selected, setSelected] = useState(dice);

  const userParams = useStore(store => store.room.userParams);
  const roomId = useStore(store => store.room.roomName);

  const [cookies, setCookie] = useCookies(['auth']);

  const [lang] = useTranslation(L18N_NAMESPACE);

  const dispatch = useDispatch();

  const handleSave = () => {
    const newParams = { ...userParams, dice: selected };
    dispatch(actions.setUserParams(newParams));
    setCookie(COOKIES_USER_PARAMS_PREFIX + roomId, newParams, COOKIES_PARAMS);

    setInEditMode(false);
  };

  const handleCancel = () => {
    setInEditMode(false);
  };

  return (
    <DiceSetPanel>
      {isInEditMode ? (
        <EditViewCintainer>
          <DiceSetEditor 
            dice={selected}
            onUpdate={setSelected}
          />
          <SaveButton onClick={handleSave}>{lang('save')}</SaveButton>
          <CancelButton onClick={handleCancel}>{lang('cancel')}</CancelButton>
        </EditViewCintainer>
      ) : (
        <EditButtonConatiner>
          <EditButton onClick={setInEditMode.bind(null, true)}>
            {lang('edit')}
          </EditButton>
        </EditButtonConatiner>
      )}
    </DiceSetPanel>
  );
}