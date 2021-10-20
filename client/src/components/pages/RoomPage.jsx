import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/room/actions';

export default function HomePage() {

  let { roomId } = useParams();

  const roomName = useSelector(state => state.room.roomName);

  const dispatch = useDispatch();

  useEffect(() => {
    if (roomName !== roomId) {
      dispatch(actions.moveToRoom(roomId));
    }
  });

  return (
    <div className="room">
      
    </div>
  );
}