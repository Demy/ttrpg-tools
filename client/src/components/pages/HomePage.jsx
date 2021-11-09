import React from 'react';
import DiceRoller from '../Dice/DiceRoller';
import NewRoomPanel from '../Room/NewRoomPanel';
import { L18N_NAMESPACE, PUBLIC_ROOM } from '../../utils/constans';
import { useTranslation } from 'react-i18next';

export default function HomePage() {

  const [lang] = useTranslation(L18N_NAMESPACE);

  return (
    <div className="home">
      <NewRoomPanel />
      <h3>{lang('public_room')}</h3>
      <DiceRoller roomId={PUBLIC_ROOM} />
    </div>
  );
}