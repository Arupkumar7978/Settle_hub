import DebtsModel from '../models/debtsModel';
import TransactionsModel from '../models/transactionsModel';
import UserModel from '../models/userModel';
import { ModelType } from '../models/types';

const ENTITY_OBJECT: { [K in keyof ModelType]: ModelType[K] } = {
  USER: UserModel,
  TRANSACTIONS: TransactionsModel,
  DEBTS: DebtsModel
};

export class ModelProvider {
  public getModel<T extends keyof ModelType>(
    entity: T
  ): ModelType[T] {
    return ENTITY_OBJECT[entity];
  }
}
