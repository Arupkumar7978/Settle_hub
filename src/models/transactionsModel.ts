/**
 * Represents a Transactions Model with necessary transactions information.
 *
 * @author arup.padhi
 */

import { DataTypes, Model, Sequelize } from 'sequelize';
import { DefineEntity } from './types';
import { ModelProvider } from '../helper/modelProvider';
import { MODEL_CONSTANTS } from '../constants/entityConstants';

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
          allowNull: true,
          references: {
            model: new ModelProvider().getModel(MODEL_CONSTANTS.USER),
            key: 'pkUserId'
          }
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
