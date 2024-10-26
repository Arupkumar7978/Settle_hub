import { Sequelize } from 'sequelize';
import UserEntity, { UserEntityDefination } from './userModel';
import { ENTITY_CONSTANTS } from '../constants/entityConstants';

interface EntityType {
  [ENTITY_CONSTANTS.USER]: typeof UserEntity;
}

const ENTITY_OBJECT: { [K in keyof EntityType]: EntityType[K] } = {
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
  public getBean<T extends keyof EntityType>(
    entity: T
  ): EntityType[T] {
    return ENTITY_OBJECT[entity];
  }
}
