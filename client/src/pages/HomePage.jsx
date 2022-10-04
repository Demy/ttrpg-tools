import React from 'react';
import DiceRoller from '../components/Dice/DiceRoller';
import NewRoomPanel from '../components/Room/NewRoomPanel';
import { L18N_NAMESPACE, PUBLIC_ROOM } from '../utils/constans';
import { useTranslation } from 'react-i18next';
import SocketControlledView from '../components/UI/SocketControlledView';

export default function HomePage() {

  const [lang] = useTranslation(L18N_NAMESPACE);

  return (
    <SocketControlledView>
      <NewRoomPanel />
      <h3>{lang('public_room')}</h3>
      <DiceRoller roomId={PUBLIC_ROOM} isPublic />
    </SocketControlledView>
  );
}