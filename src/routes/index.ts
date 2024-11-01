import { Router } from 'express';
import UserRouter from './userRoutes';
import transactionRouter from './transactionRoutes';
import { ROUTES } from '../constants/routesConstant';

const router = Router();

router.use(`/${ROUTES.USER}`, UserRouter);
router.use(`/${ROUTES.TRANSACTION}`, transactionRouter);

export default router;
