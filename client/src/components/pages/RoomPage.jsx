import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/room/actions';
import RoomView from '../Room/RoomView';
import RoomLogIn from '../Room/RoomLogIn';
import Loading from '../UI/Loading';

export default function RoomPage() {

  let { roomId } = useParams();

  const roomName = useSelector(state => state.room.roomName);
  const roomStatus = useSelector(state => state.room.roomStatus);
  const roomToken = useSelector(state => state.room.roomToken);
  const socket = useSelector(state => state.room.socket);

  const [needLogIn, setNeedLogIn] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (roomName !== roomId) {
      dispatch(actions.getRoomStatus(roomId));
    }
  }, [dispatch, roomId, roomName]);

  useEffect(() => {
    if (roomStatus !== null) {
      if (roomStatus.private) {
        setNeedLogIn(true);
      } else {
        socket.emit('joinRoom', { roomId });
        dispatch(actions.moveToRoom(roomId));
      }
    }
  }, [dispatch, roomId, roomStatus, socket]);

  useEffect(() => {
    if (needLogIn && roomToken) {
      socket.emit('joinRoom', { roomId });
      dispatch(actions.moveToRoom(roomId));
      setNeedLogIn(false);
    }
  }, [dispatch, needLogIn, roomId, roomToken, socket]);

  return (
    <div className="room">
      {roomName === roomId ? <RoomView /> : (
        needLogIn ? <RoomLogIn roomId={roomId} /> : <Loading />
      )}
    </div>
  );
}
