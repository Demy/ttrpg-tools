import './App.css';
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import DiceRoller from './components/Dice/DiceRoller';

function App() {

  const [response, setResponse] = useState('');

  useEffect(() => {
    const socket = socketIOClient('http://localhost:4000');
    socket.on('FromAPI', (data) => {
      setResponse(data);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="App">
      <DiceRoller />
      {response}
    </div>
  );
}

export default App;
