import { Router } from 'express';
import {
  AUTHENTICATION,
  USER_AUTHENTICATION_ROUTES
} from '../constants/routesConstant';

const router = Router();

const { SIGN_IN } = USER_AUTHENTICATION_ROUTES;

router.get(`/${AUTHENTICATION}/${SIGN_IN}`, (req, res) => {
  res.send('Authentication Successfull.');
});

export default router;
