/**
 * Represents a User entity with necessary user information.
 *
 * @author arup.padhi
 */

import { DataTypes, Model, Sequelize } from 'sequelize';

export interface DefineEntity {
  define(): void;
}

export default class UserEntity extends Model {
  declare id: number;
  declare userUUID: string | undefined;
  declare name: string;
  declare email: string;
  declare userName: string;
  declare password: string;
}

export class UserEntityDefination implements DefineEntity {
  private sequelizeInstance: Sequelize;

  constructor(instance: Sequelize) {
    this.sequelizeInstance = instance;
  }

  define(): void {
    UserEntity.init(
      {
        id: {
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
        }
      },
      {
        tableName: 'users',
        sequelize: this.sequelizeInstance,
        indexes: [{ unique: true, fields: ['id'] }]
      }
    );
  }
}
