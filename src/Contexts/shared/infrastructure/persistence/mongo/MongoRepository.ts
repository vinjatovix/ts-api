import { Collection, MongoClient, MongoServerError, ObjectId } from 'mongodb';
import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { AggregateRoot } from '../../../domain/AggregateRoot';
import { Username } from '../../../../apiApp/Auth/domain';
import { updateMetadata } from '../../../application/utils';
import { MongoErrorHandler } from './MongoErrorHandler';
import { MongoFetchService } from './MongoFetchService';
import { Entity } from './Entity';

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

  protected async handleMongoError<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (err: unknown) {
      if (err instanceof MongoServerError) {
        MongoErrorHandler.formatError(err);
      }
      throw err;
    }
  }

  protected async fetch<T extends Entity>({
    id,
    options
  }: {
    id?: string;
    options: Partial<RequestOptions>;
  }): Promise<T[]> {
    const collection = await this.collection();
    return MongoFetchService.fetch<T>({ collection, id, options });
  }
}
