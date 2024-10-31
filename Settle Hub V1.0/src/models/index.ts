import { Sequelize } from 'sequelize';
import UserEntity, { UserEntityDefination } from './userModel';
import { ENTITY_CONSTANTS } from '../constants/entityConstants';

export type BeanType = {
  [ENTITY_CONSTANTS.USER]: typeof UserEntity;
};

const ENTITY_OBJECT: { [K in keyof BeanType]: BeanType[K] } = {
  USER: UserEntity
};

export class InjectSequelizeDependency {
  private sequelizeInstance: Sequelize;

  constructor(instance: Sequelize) {
    this.sequelizeInstance = instance;
  }

  inject(): void {
    new UserEntityDefination(this.sequelizeInstance).define();
  } 
}

export class BeanProvider {
  public getBean<T extends keyof BeanType>(entity: T): BeanType[T] {
    return ENTITY_OBJECT[entity];
  }
}
