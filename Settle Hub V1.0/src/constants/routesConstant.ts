export const API_ENDPOINT = 'api';
export const API_VERSION = 'v1';
export const AUTHENTICATION = 'authentication';

export const ROUTES = {
  USER: 'user',
  TRANSACTION: 'transaction'
} as const;

export const USER_AUTHENTICATION_ROUTES = {
  SIGN_IN: 'signIn',
  REGISTER: 'register'
} as const;

export const USER_TRSANSACTION_ROUTES = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
} as const;
