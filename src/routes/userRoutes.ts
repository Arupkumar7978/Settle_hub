import { Router } from 'express';
import {
  AUTHENTICATION,
  USER_AUTHENTICATION_ROUTES
} from '../constants/routesConstant';
import {
  AuthenticateUser,
  CreateNewUser
} from '../services/userService';

const router = Router();

const { SIGN_IN, REGISTER } = USER_AUTHENTICATION_ROUTES;

router.post(`/${AUTHENTICATION}/${SIGN_IN}`, AuthenticateUser);

router.post(`/${AUTHENTICATION}/${REGISTER}`, CreateNewUser);

export default router;
