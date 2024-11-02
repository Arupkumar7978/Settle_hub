import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';

interface DatabaseSequelizer {
  getInstance(): Sequelize;
}

// Load .env properties
dotenv.config();

export default class DatabaseConnector implements DatabaseSequelizer {
  private DB_NAME = process.env.DB_NAME || '';
  private DB_USER = process.env.DB_USER || '';
  private DB_HOST = process.env.DB_HOST || '';
  private DB_PASSWORD = process.env.DB_PASSWORD || '';
  private DB_DIALECT: Dialect =
    (process.env.DB_DIALECT as Dialect) || 'mysql';

  private static sequelizeInstance: Sequelize | undefined;

  private connect(): Sequelize {
    DatabaseConnector.sequelizeInstance = new Sequelize(
      this.DB_NAME,
      this.DB_USER,
      this.DB_PASSWORD,
      {
        host: this.DB_HOST,
        dialect: this.DB_DIALECT
      }
    );
    return DatabaseConnector.sequelizeInstance;
  }

  getInstance(): Sequelize {
    if (!DatabaseConnector.sequelizeInstance) {
      return this.connect();
    }
    return DatabaseConnector.sequelizeInstance;
  }
}
