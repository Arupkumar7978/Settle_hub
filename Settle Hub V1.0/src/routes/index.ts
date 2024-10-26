import { Router } from 'express';
import UserRouter from './userRoutes';
import { ROUTES } from '../constants/routesConstant';

const router = Router();

router.use(`/${ROUTES.USER}`, UserRouter);

export default router;
