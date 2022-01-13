import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../redux/room/actions';
import RoomView from '../components/Room/RoomView';
import RoomLogIn from '../components/Room/RoomLogIn';
import Loading from '../components/UI/Loading';
import { useCookies } from 'react-cookie';
import CookieConsent, { getCookieConsentValue, OPTIONS } from 'react-cookie-consent';
import { useTranslation } from 'react-i18next';
import { 
  L18N_NAMESPACE, COOKIES_TOKEN_PREFIX, COOKIES_USER_PREFIX, 
  COOKIES_PARAMS, COOKIES_USER_PARAMS_PREFIX 
} from '../utils/constans';
import SocketControlledView from '../components/UI/SocketControlledView';

export default function RoomPage() {

  let { roomId } = useParams();

  const roomName = useSelector(state => state.room.roomName);
  const roomStatus = useSelector(state => state.room.roomStatus);
  const username = useSelector(state => state.room.username);
  const userParams = useSelector(state => state.room.userParams);
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
      dispatch(actions.setUserParams(null));

      dispatch(actions.getRoomStatus(roomId));
    }
  }, [dispatch, roomId, roomName]);

  useEffect(() => {
    if (canUseCookies) {
      const token = cookies[COOKIES_TOKEN_PREFIX + roomId];
      const user = cookies[COOKIES_USER_PREFIX + roomId];
      const params = cookies[COOKIES_USER_PARAMS_PREFIX + roomId];

      if (user) {
        dispatch(actions.setUser(user));
        if (params && params !== '') {
          dispatch(actions.setUserParams(params));
        } else {
          dispatch(actions.setUserParams(null));
        }
      } else {
        dispatch(actions.setUser(''));
        dispatch(actions.setUserParams(null));
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
    if (!username) return;

    if (needLogIn) {
      if (roomToken) {
        setIsAuthorized(true);
        setNeedLogIn(false);
        if (canUseCookies) {
          setCookie(COOKIES_TOKEN_PREFIX + roomId, roomToken, COOKIES_PARAMS);
          setCookie(COOKIES_USER_PREFIX + roomId, username, COOKIES_PARAMS);
          setCookie(COOKIES_USER_PARAMS_PREFIX + roomId, userParams, COOKIES_PARAMS);
        }
      }
    } else {
      if (isAuthorized && canUseCookies) {
        setCookie(COOKIES_USER_PREFIX + roomId, username, COOKIES_PARAMS);
        setCookie(COOKIES_USER_PARAMS_PREFIX + roomId, userParams, COOKIES_PARAMS);
      }
    }
  }, [
    canUseCookies, isAuthorized, needLogIn, roomId, roomToken, 
    setCookie, userParams, username
  ]);

  const handleCookieAccept = () => {
    if (isAuthorized) {
      if (roomToken) {
        setCookie(COOKIES_TOKEN_PREFIX + roomId, roomToken, COOKIES_PARAMS);
      }
      setCookie(COOKIES_USER_PREFIX + roomId, username, COOKIES_PARAMS);
      setCookie(COOKIES_USER_PARAMS_PREFIX + roomId, userParams, COOKIES_PARAMS);
    }
  };

  return (
    <SocketControlledView>
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
    </SocketControlledView>
  );
}
