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
    return {
      ...mongoConfig,
      connectionString: MongoConfigFactory.createMongoUri()
    };
  }

  static createMongoUri(): string {
    const { username, password, connection, url, db } = mongoConfig;
    const encodedPassword = encodeURIComponent(password);
    const credentials =
      username && encodedPassword ? `${username}:${encodedPassword}@` : '';
    const baseConnectionString = `${connection}://${credentials}${url}/${db}`;

    return connection === 'mongodb+srv'
      ? `${baseConnectionString}?retryWrites=true&w=majority&appName=Cluster0`
      : baseConnectionString;
  }
}
