import { MongoClient } from 'mongodb';
import { EnvironmentArranger } from '../arranger/EnvironmentArranger';
import { buildLogger } from '../../../../../src/Contexts/shared/plugins/logger.plugin';

const logger = buildLogger('mongoEnvironmentArranger');

export class MongoEnvironmentArranger extends EnvironmentArranger {
  constructor(private _client: Promise<MongoClient>) {
    super();
  }

  public async arrange(): Promise<void> {
    await this.cleanDatabase();
    logger.info('MongoDB database cleaned');
  }

  public async close(): Promise<void> {
    (await this.client()).close();
    logger.info('MongoDB connection closed');
  }

  private async collections(): Promise<string[]> {
    const client = await this.client();
    const collections = await client
      .db()
      .listCollections(undefined, { nameOnly: true })
      .toArray();

    return collections.map((collection) => collection.name);
  }

  protected client(): Promise<MongoClient> {
    return this._client;
  }

  protected async cleanDatabase(): Promise<void> {
    const collections = await this.collections();
    const client = await this.client();

    for (const collection of collections) {
      await client.db().collection(collection).deleteMany({});
    }
  }
}
