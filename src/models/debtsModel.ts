/**
 * Represents a Debts Model with necessary debts information.
 *
 * @author arup.padhi
 */

import { DataTypes, Model, Sequelize } from 'sequelize';
import { DefineEntity } from './types';
import { ModelProvider } from '../helper/modelProvider';
import { MODEL_CONSTANTS } from '../constants/entityConstants';
import TransactionsModel from './transactionsModel';

export default class DebtsModel extends Model {
  declare pkDebtId: number;
  declare debtorId: number;
  declare creditorId: number;
  declare amountOwed: number;
  declare fkTransactionId: number;
  declare isSettled: boolean;
}

export class DebtsModelDefination implements DefineEntity {
  // Fixed class name
  private sequelizeInstance: Sequelize;

  constructor(instance: Sequelize) {
    this.sequelizeInstance = instance;
  }

  define(): void {
    DebtsModel.init(
      {
        pkDebtId: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true
        },
        debtorId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          references: {
            model: new ModelProvider().getModel(MODEL_CONSTANTS.USER),
            key: 'pkUserId'
          }
        },
        creditorId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: new ModelProvider().getModel(MODEL_CONSTANTS.USER),
            key: 'pkUserId'
          }
        },
        fkTransactionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: TransactionsModel,
            key: 'pkTransactionId'
          }
        },
        amountOwed: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        },
        isSettled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      },
      {
        tableName: 'debts_info',
        sequelize: this.sequelizeInstance,
        indexes: [{ fields: ['pkDebtId'] }]
      }
    );
  }
}
