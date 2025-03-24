import { Collection, MongoClient, ObjectId } from 'mongodb';
import { AggregateRoot } from '../../../domain/AggregateRoot';
import { Username } from '../../../../apiApp/Auth/domain';
import { updateMetadata } from '../../../application/utils';

export abstract class MongoRepository<T extends AggregateRoot> {
  constructor(private readonly _client: Promise<MongoClient>) {}

  protected abstract collectionName(): string;

  protected client(): Promise<MongoClient> {
    return this._client;
  }

  protected async collection(): Promise<Collection> {
    return (await this.client()).db().collection(this.collectionName());
  }

  protected async persist(
    id: string,
    aggregateRoot: T,
    username?: Username
  ): Promise<void> {
    const collection = await this.collection();
    const document = {
      ...aggregateRoot.toPrimitives(),
      _id: id,
      id: undefined,
      ...(username && updateMetadata(username))
    };

    await collection.updateOne(
      { _id: id as unknown as ObjectId },
      { $set: document },
      { upsert: true }
    );
  }

  protected async delete(id: string): Promise<void> {
    const collection = await this.collection();
    await collection.deleteOne({ _id: id as unknown as ObjectId });
  }
}
