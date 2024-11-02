import { Sequelize } from 'sequelize';
import { UserModelDefination } from './userModel';
import { TransactionsModelDefination } from './transactionsModel';
import { DebtsModelDefination } from './debtsModel';

export class InjectSequelizeDependency {
  private sequelizeInstance: Sequelize;

  constructor(instance: Sequelize) {
    this.sequelizeInstance = instance;
  }

  inject(): void {
    new UserModelDefination(this.sequelizeInstance).define();
    new TransactionsModelDefination(this.sequelizeInstance).define();
    new DebtsModelDefination(this.sequelizeInstance).define();
  }
}
