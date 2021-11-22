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

const TOKEN_PREFIX = 'token__';
const USER_PREFIX = 'user__'

export default function RoomPage() {

  let { roomId } = useParams();

  const roomName = useSelector(state => state.room.roomName);
  const roomStatus = useSelector(state => state.room.roomStatus);
  const username = useSelector(state => state.room.username);
  const roomToken = useSelector(state => state.room.roomToken);

  const canUseCookies = getCookieConsentValue();

  const [cookies, setCookie] = useCookies(['auth']);

  const [needLogIn, setNeedLogIn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [lang] = useTranslation(L18N_NAMESPACE);

  const dispatch = useDispatch();

  useEffect(() => {
    if (roomName !== roomId) {
      dispatch(actions.clearToken());
      dispatch(actions.setUser(''));
      dispatch(actions.getRoomStatus(roomId));
    }
  }, [dispatch, roomId, roomName]);

  useEffect(() => {
    if (canUseCookies) {
      const token = cookies[TOKEN_PREFIX + roomId];
      const user = cookies[USER_PREFIX + roomId];
      if (user) {
        dispatch(actions.setUser(user));
      } else {
        dispatch(actions.setUser(''));
      }
      if (user && token) {
        dispatch(actions.verifyAndSaveToken(token, roomId));
      } else {
        dispatch(actions.clearToken());
      }
    }
  }, [canUseCookies, cookies, dispatch, roomId]);

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
      if (canUseCookies) {
        setCookie(TOKEN_PREFIX + roomId, roomToken);
        setCookie(USER_PREFIX + roomId, username);
      }
    }
  }, [canUseCookies, needLogIn, roomId, roomToken, setCookie, username]);

  useEffect(() => {
    if (!needLogIn && isAuthorized && username && canUseCookies) {
      setCookie(USER_PREFIX + roomId, username);
    }
  }, [canUseCookies, isAuthorized, needLogIn, roomId, setCookie, username]);

  const handleCookieAccept = () => {
    if (isAuthorized) {
      if (roomToken) {
        setCookie(TOKEN_PREFIX + roomId, roomToken);
      }
      setCookie(USER_PREFIX + roomId, username);
    }
  };

  return (
    <div className="room">
      {isAuthorized && username !== '' ? <RoomView roomId={roomId} /> : (
        needLogIn || username === '' ? <RoomLogIn roomId={roomId} needPassword={needLogIn} /> : 
          <Loading middle />
      )}
      <CookieConsent 
        enableDeclineButton
        location={OPTIONS.BOTTOM}
        style={{ 
          background: "#ffffff", 
          color: '#252525', 
          textAlign: 'left', 
          border: '1px solid #d0d0d0'
        }}
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
