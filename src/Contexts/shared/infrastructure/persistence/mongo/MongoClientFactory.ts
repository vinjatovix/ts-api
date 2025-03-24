import { UUID } from 'bson';
import { MongoClient, MongoServerError } from 'mongodb';
import { INDEXES } from '../../../../apiApp/shared/infraestructure/MongoCollectionIndexes';
import MongoConfig from './MongoConfig';

interface IndexConfig {
  collection: string;
  indexes: string[][];
}

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
      await MongoClientFactory.ensureIndexes(client, config.db, INDEXES);
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

  private static async ensureIndexes(
    client: MongoClient,
    dbName: string,
    indexes: IndexConfig[]
  ) {
    const db = client.db(dbName);

    await Promise.all(
      indexes.flatMap(({ collection, indexes }) =>
        indexes.map(async (fieldsArray) => {
          const fields = Object.fromEntries(
            fieldsArray.map((field) => [field, 1])
          );

          try {
            await db
              .collection(collection)
              .createIndex(fields, { unique: true });
          } catch (error: unknown) {
            if ((error as MongoServerError).code !== 11000) {
              console.error(
                `Error creating index in ${collection}: ${JSON.stringify(fields)}`,
                error
              );

              throw error;
            }
          }
        })
      )
    );
  }
}
