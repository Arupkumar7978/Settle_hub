/**
 * Represents a User entity with necessary user information.
 *
 * @author arup.padhi
 */

import { DataTypes, Model, Sequelize } from 'sequelize';
import { DefineEntity } from './types';

export default class UserModel extends Model {
  declare pkUserId: number;
  declare userUUID: string | undefined;
  declare name: string;
  declare email: string;
  declare userName: string;
  declare password: string;
}

export class UserModelDefination implements DefineEntity {
  private sequelizeInstance: Sequelize;

  constructor(instance: Sequelize) {
    this.sequelizeInstance = instance;
  }

  define(): void {
    UserModel.init(
      {
        pkUserId: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
          unique: true
        },
        userUUID: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4
        },
        name: {
          type: new DataTypes.STRING(128),
          allowNull: false
        },
        email: {
          type: new DataTypes.STRING(128),
          allowNull: false
        },
        userName: {
          type: DataTypes.STRING(64),
          allowNull: false
        },
        password: {
          type: DataTypes.STRING(128),
          allowNull: false
        },
        defaultCurrency: {
          type: DataTypes.STRING(32),
          defaultValue: 'INR'
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        }
      },
      {
        tableName: 'users',
        sequelize: this.sequelizeInstance,
        indexes: [{ unique: true, fields: ['pkUserId'] }]
      }
    );
  }
}
