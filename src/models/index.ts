import { Sequelize } from 'sequelize';
import UserEntity, { UserEntityDefination } from './userModel';
import { MODEL_CONSTANTS } from '../constants/entityConstants';
import TransactionsModel, {
  TransactionsModelDefination
} from './transactionsModel';

export type BeanType = {
  [MODEL_CONSTANTS.USER]: typeof UserEntity;
  [MODEL_CONSTANTS.TRANSACTIONS]: typeof TransactionsModel;
};

const ENTITY_OBJECT: { [K in keyof BeanType]: BeanType[K] } = {
  USER: UserEntity,
  TRANSACTIONS: TransactionsModel
};

export class InjectSequelizeDependency {
  private sequelizeInstance: Sequelize;

  constructor(instance: Sequelize) {
    this.sequelizeInstance = instance;
  }

  inject(): void {
    new UserEntityDefination(this.sequelizeInstance).define();
    new TransactionsModelDefination(this.sequelizeInstance).define();
  }
}

export class BeanProvider {
  public getBean<T extends keyof BeanType>(entity: T): BeanType[T] {
    return ENTITY_OBJECT[entity];
  }
}
