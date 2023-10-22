import config from '../../config';
import MongoConfig from './MongoConfig';

const mongoConfig = {
  connection: config.get('mongo.connection'),
  url: config.get('mongo.url'),
  db: config.get('mongo.db'),
  username: config.get('mongo.username'),
  password: config.get('mongo.password')
};

export class MongoConfigFactory {
  static createConfig(): MongoConfig {
    return mongoConfig;
  }
}
