/**
 * Represents a Transactions Model with necessary transactions information.
 *
 * @author arup.padhi
 */

import { DataTypes, Model, Sequelize } from 'sequelize';
import { DefineEntity } from './types';

export default class TransactionsModel extends Model {
  declare pkTransactionId: number;
  declare payerId: number;
  declare name: string;
  declare totalAmount: number;
  declare description: string;
}

export class TransactionsModelDefination implements DefineEntity {
  private sequelizeInstance: Sequelize;

  constructor(instance: Sequelize) {
    this.sequelizeInstance = instance;
  }

  define(): void {
    TransactionsModel.init(
      {
        pkTransactionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
          unique: true
        },
        payerId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true
        },
        name: {
          type: new DataTypes.STRING(64),
          allowNull: false
        },
        description: {
          type: new DataTypes.STRING(128),
          allowNull: true
        },
        totalAmount: {
          type: new DataTypes.DECIMAL(),
          allowNull: false
        }
      },
      {
        tableName: 'transactions',
        sequelize: this.sequelizeInstance,
        indexes: [{ unique: true, fields: ['pkTransactionId'] }]
      }
    );
  }
}
