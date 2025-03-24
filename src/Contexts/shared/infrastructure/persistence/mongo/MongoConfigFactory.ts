import { envs } from '../../../../../config/plugins';
import MongoConfig from './interfaces/MongoConfig';

const mongoConfig = {
  connection: envs.MONGO_CONNECTION,
  url: envs.MONGO_URL,
  db: envs.MONGO_DB,
  username: envs.MONGO_USERNAME,
  password: envs.MONGO_PASSWORD
};

export class MongoConfigFactory {
  static createConfig(): MongoConfig {
    return mongoConfig;
  }
}
