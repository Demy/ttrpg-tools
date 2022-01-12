import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../redux/room/actions';
import RoomView from '../components/Room/RoomView';
import RoomLogIn from '../components/Room/RoomLogIn';
import Loading from '../components/UI/Loading';
import { 
  STORAGE_TOKEN_PREFIX, STORAGE_USER_PREFIX, 
  STORAGE_USER_PAAMS_PREFIX 
} from '../utils/constans';
import SocketControlledView from '../components/UI/SocketControlledView';

export default function RoomPage() {

  let { roomId } = useParams();

  const roomName = useSelector(state => state.room.roomName);
  const roomStatus = useSelector(state => state.room.roomStatus);
  const username = useSelector(state => state.room.username);
  const roomToken = useSelector(state => state.room.roomToken);

  const [needLogIn, setNeedLogIn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (roomName !== roomId) {
      dispatch(actions.clearToken());
      dispatch(actions.setUser(''));
      dispatch(actions.getRoomStatus(roomId));
    }
  }, [dispatch, roomId, roomName]);

  useEffect(() => {
    const token = localStorage.getItem[STORAGE_TOKEN_PREFIX + roomId];
    const user = localStorage.getItem[STORAGE_USER_PREFIX + roomId];
    const params = localStorage.getItem(STORAGE_USER_PAAMS_PREFIX + roomId);
    if (user) {
      dispatch(actions.setUser(user));
      if (params) {
        dispatch(actions.setUserParams(JSON.parse(params)));
      }
    } else {
      dispatch(actions.setUser(''));
    }
    if (user && token) {
      dispatch(actions.verifyAndSaveToken(token, roomId));
    } else {
      dispatch(actions.clearToken());
    }
  }, [dispatch, roomId]);

  useEffect(() => {
    if (roomStatus !== null) {
      if (roomStatus.private && !roomToken) {
        setNeedLogIn(true);
      } else {
        setIsAuthorized(true);
      }
    }
  }, [roomStatus, roomToken]);

  useEffect(() => {
    if (needLogIn && roomToken && username) {
      setIsAuthorized(true);
      setNeedLogIn(false);
      localStorage.setItem(STORAGE_TOKEN_PREFIX + roomId, roomToken);
      localStorage.setItem(STORAGE_USER_PREFIX + roomId, username);
    }
  }, [needLogIn, roomId, roomToken, username]);

  useEffect(() => {
    if (!needLogIn && isAuthorized && username) {
      localStorage.setItem(STORAGE_USER_PREFIX + roomId, username);
    }
  }, [isAuthorized, needLogIn, roomId, username]);

  return (
    <SocketControlledView>
      {isAuthorized && username !== '' ? <RoomView roomId={roomId} /> : (
        needLogIn || username === '' ? <RoomLogIn roomId={roomId} needPassword={needLogIn} /> : 
          <Loading middle />
      )}
    </SocketControlledView>
  );
}
