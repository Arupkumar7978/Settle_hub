import { Router } from "express";
import {
  AUTHENTICATION,
  USER_AUTHENTICATION_ROUTES,
} from "../constants/routesConstant";
import {
  AuthenticateUser,
  CreateNewUser,
  LogoutUser,
} from "../services/userService";

const router = Router();

const { SIGN_IN, REGISTER, LOG_OUT } = USER_AUTHENTICATION_ROUTES;

router.post(`/${AUTHENTICATION}/${SIGN_IN}`, AuthenticateUser);

router.post(`/${AUTHENTICATION}/${REGISTER}`, CreateNewUser);

router.post(`/${AUTHENTICATION}/${LOG_OUT}`, LogoutUser);

router.get(`/test`, () => {
  console.log("worked");
});

export default router;
