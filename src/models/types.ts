import { MODEL_CONSTANTS } from '../constants/entityConstants';
import UserModel from './userModel';
import TransactionsModel from './transactionsModel';
import DebtsModel from './debtsModel';

export interface DefineEntity {
  define(): void;
}

export type ModelType = {
  [MODEL_CONSTANTS.USER]: typeof UserModel;
  [MODEL_CONSTANTS.TRANSACTIONS]: typeof TransactionsModel;
  [MODEL_CONSTANTS.DEBTS]: typeof DebtsModel;
};
