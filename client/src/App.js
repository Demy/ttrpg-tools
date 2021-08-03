import './App.css';
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import HomePage from './components/pages/HomePage';
import DiceRollerPage from './components/pages/DiceRollerPage';
import RollResultPage from './components/pages/RollResultPage';

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
        <Router>
          <Switch>
            <Route path="/roll/:rollId">
              <RollResultPage />
            </Route>
            <Route path="/roll">
              <DiceRollerPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
          <ToastContainer />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
