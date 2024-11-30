import { Router } from 'express';
import { USER_TRSANSACTION_ROUTES } from '../constants/routesConstant';
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '../services/transactionsService';

const router = Router();

const { CREATE, UPDATE, DELETE } = USER_TRSANSACTION_ROUTES;

router.post(`/${CREATE}`, createTransaction);

router.put(`/${UPDATE}`, updateTransaction);

router.delete(`/${DELETE}/:transactionId`, deleteTransaction);

export default router;
