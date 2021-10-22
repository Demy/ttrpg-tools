import React from 'react';
import DiceRoller from '../Dice/DiceRoller';
import NewRoomPanel from '../Room/NewRoomPanel';
import { PUBLIC_ROOM } from '../../utils/constans';

export default function HomePage() {

  return (
    <div className="home">
      <NewRoomPanel />
      <h3>Public room</h3>
      <DiceRoller roomId={PUBLIC_ROOM} />
    </div>
  );
}