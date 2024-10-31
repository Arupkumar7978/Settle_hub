import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';

interface DatabaseSequelizer {
  connect(): Sequelize;
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

  private static sequelizeInstance = new Sequelize(
    process.env.DB_NAME || '',
    process.env.DB_USER || '',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || '',
      dialect: 'mysql'
    }
  );
  constructor() {
    // this.sequelizeInstance = new Sequelize(
    //   this.DB_NAME,
    //   this.DB_USER,
    //   this.DB_PASSWORD,
    //   {
    //     host: this.DB_HOST,
    //     dialect: this.DB_DIALECT
    //   }
    // );
  }

  connect(): Sequelize {
    // this.initiateDatabaseConnection();
    return DatabaseConnector.sequelizeInstance;
  }

  private async initiateDatabaseConnection() {
    try {
      await DatabaseConnector.sequelizeInstance.authenticate();
      console.log(
        'Database Connection has been established successfully.'
      );
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}
