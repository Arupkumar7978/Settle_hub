import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import DatabaseConnector from './config/database';
import { Sequelize } from 'sequelize';
import { InjectSequelizeDependency } from './models';
import GenericRouter from './routes/index';
import {
  API_ENDPOINT,
  API_VERSION
} from './constants/routesConstant';
import dotenv from 'dotenv';

dotenv.config();

interface ServerSetup {
  setupMiddlewares(): void;
  setupRoutes(): void;
  initiateDatabaseConnection(): void;
  injectDependency(): void;
}

async function initiateDatabaseConnection(
  sequelizeInstance: Sequelize
) {
  try {
    await sequelizeInstance.authenticate();
    console.log(
      'Database Connection has been established successfully.'
    );
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

class App implements ServerSetup {
  public app = express();
  private sequelizeInstance?: Sequelize;

  constructor() {
    this.setupMiddlewares();
    this.initiateDatabaseConnection();
    this.injectDependency();
    this.setupRoutes();
  }

  setupMiddlewares(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(bodyParser.json());
  }
  initiateDatabaseConnection(): void {
    const dbConnector = new DatabaseConnector();
    this.sequelizeInstance = dbConnector.getInstance();
    // performs the necessary changes in the table to make it match the model.
    if (this.sequelizeInstance) {
      initiateDatabaseConnection(this.sequelizeInstance);
      this.sequelizeInstance.sync({ alter: true });
    }
  }
  injectDependency(): void {
    if (this.sequelizeInstance) {
      const injector = new InjectSequelizeDependency(
        this.sequelizeInstance
      );
      injector.inject();
      // injector.defineAssosiations();
    }
  }

  setupRoutes(): void {
    this.app.use(`/${API_ENDPOINT}/${API_VERSION}`, GenericRouter);
  }
}

export default new App().app;
