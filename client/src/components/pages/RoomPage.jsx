import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/room/actions';
import RoomView from '../Room/RoomView';
import RoomLogIn from '../Room/RoomLogIn';
import Loading from '../UI/Loading';
import { useCookies } from 'react-cookie';
import CookieConsent, { getCookieConsentValue, OPTIONS } from 'react-cookie-consent';
import { useTranslation } from 'react-i18next';
import { L18N_NAMESPACE } from '../../utils/constans';

export default function RoomPage() {

  let { roomId } = useParams();

  const roomName = useSelector(state => state.room.roomName);
  const roomStatus = useSelector(state => state.room.roomStatus);
  const roomToken = useSelector(state => state.room.roomToken);
  const socket = useSelector(state => state.room.socket);

  const canUseCookies = getCookieConsentValue();

  const [cookies, setCookie] = useCookies(['token']);

  const [needLogIn, setNeedLogIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [lang] = useTranslation(L18N_NAMESPACE);

  const dispatch = useDispatch();

  useEffect(() => {
    if (roomName !== roomId) {
      dispatch(actions.getRoomStatus(roomId));
    }
  }, [dispatch, roomId, roomName]);

  useEffect(() => {
    if (roomStatus !== null) {
      if (roomStatus.private && !roomToken) {
        setNeedLogIn(true);
      } else {
        setIsConnected(true);
      }
    }
  }, [dispatch, roomId, roomStatus, roomToken, socket]);

  useEffect(() => {
    if (needLogIn && roomToken) {
      setIsConnected(true);
      setNeedLogIn(false);
      if (canUseCookies) {
        setCookie('token', roomToken, { path: '/room' });
      }
    }
  }, [canUseCookies, dispatch, needLogIn, roomId, roomToken, setCookie, socket]);

  useEffect(() => {
    if (canUseCookies) {
      const token = cookies.token;
      if (token && !roomToken) {
        dispatch(actions.verifyAndSaveToken(token, roomId));
      }
    }
  }, [canUseCookies, cookies.token, dispatch, roomId, roomToken]);

  const handleCookieAccept = () => {
    if (roomToken) {
      setCookie('token', roomToken, { path: '/room' });
    }
  };

  return (
    <div className="room">
      {isConnected ? <RoomView roomId={roomId} /> : (
        needLogIn ? <RoomLogIn roomId={roomId} /> : <Loading middle />
      )}
      <CookieConsent 
        enableDeclineButton
        location={OPTIONS.BOTTOM}
        style={{ background: "#dddddd", color: '#252525', textAlign: 'left' }}
        buttonStyle={{ 
          color: "#4e503b", 
          fontSize: "1em", 
          borderRadius: "5px", 
          padding: "10px 20px",
          border: "1px solid #c0c0c0"
        }}
        buttonText={lang('cookies_accept')}
        declineButtonText={lang('cookies_decline')}
        onAccept={handleCookieAccept}
      >
        {lang('cookies_descr')}
      </CookieConsent>
    </div>
  );
}
