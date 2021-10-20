import React from 'react';
import DiceRoller from '../Dice/DiceRoller';
import RoomPanel from '../Room/RoomPanel';

export default function HomePage() {

  return (
    <div className="home">
      <RoomPanel />
      <h3>Public room</h3>
      <DiceRoller />
    </div>
  );
}