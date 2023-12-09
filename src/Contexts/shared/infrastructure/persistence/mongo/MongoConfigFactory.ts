import { envs } from '../../../../../config/plugins/envs.plugin';
import MongoConfig from './MongoConfig';

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
