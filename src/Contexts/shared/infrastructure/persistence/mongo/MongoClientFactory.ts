import { UUID } from 'bson';
import { MongoClient } from 'mongodb';
import MongoConfig from './MongoConfig';

export class MongoClientFactory {
  private static clients: { [key: string]: MongoClient } = {};

  static async createClient(
    contextName: string,
    config: MongoConfig
  ): Promise<MongoClient> {
    let client = MongoClientFactory.getClient(contextName);

    if (!client) {
      client = await MongoClientFactory.createAndConnectClient(config);

      MongoClientFactory.registerClient(client, contextName);
    }

    return client;
  }

  private static getClient(contextName: string): MongoClient | null {
    return MongoClientFactory.clients[contextName];
  }

  private static async createAndConnectClient(
    config: MongoConfig
  ): Promise<MongoClient> {
    try {
      const connectionString = `${config.connection}://${config.username}:${config.password}@${config.url}/${config.db}`;
      const client = new MongoClient(connectionString, {
        ignoreUndefined: true,
        pkFactory: { createPk: () => new UUID().toBinary() }
      });

      await client.connect();
      console.info('MongoClient connected');

      return client;
    } catch (error) {
      console.error('MongoClient connection error', error);
      return await MongoClientFactory.createAndConnectClient(config);
    }
  }

  private static registerClient(
    client: MongoClient,
    contextName: string
  ): void {
    MongoClientFactory.clients[contextName] = client;
  }

  static async closeClient(contextName: string): Promise<void> {
    const client = MongoClientFactory.getClient(contextName);

    if (client) {
      await client.close();
    }
  }
}
