import './App.css';
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import DiceRoller from './components/Dice/DiceRoller';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Redux
import { Provider } from 'react-redux';
import store from './redux';

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
      <Provider store={store}>
        <DiceRoller />
        {response}
        <ToastContainer />
      </Provider>
    </div>
  );
}

export default App;
