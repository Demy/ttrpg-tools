import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from './components/pages/HomePage';
import DiceRollerPage from './components/pages/DiceRollerPage';
import RollResultPage from './components/pages/RollResultPage';
import RoomPage from './components/pages/RoomPage';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './redux/room/actions';
import { Socket } from './helpers/socket';

import './App.css';
import Header from './components/UI/Header';

const socketClient = Socket.build();

function App() {

  const socket = useSelector(state => state.room.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket === null) {
      dispatch(actions.setSocket(socketClient));
    }
  }, [dispatch, socket]);

  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route path="/room/:roomId">
            <RoomPage />
          </Route>
          <Route path="/roll/:roomId/:rollId">
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
    </div>
  );
}

export default App;
