export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const END_POINT = {
  ROLL: 'roll',
  ROLLS_HISTORY: 'history',
  ROOM_STATUS: 'room',
  ROOM_LOGIN: 'room-login',
  VERIFY_TOKEN: 'verify',
};
export const PUBLIC_ROOM = 'public';
export const L18N_NAMESPACE = 'ttrpg';

export const MOBILE_SCREEN = '910px';

export const COOKIES_TOKEN_PREFIX = 'token__';
export const COOKIES_USER_PREFIX = 'user__'
export const COOKIES_USER_PARAMS_PREFIX = 'user_params__';
export const COOKIES_PARAMS = { path: '/room', secure: true };