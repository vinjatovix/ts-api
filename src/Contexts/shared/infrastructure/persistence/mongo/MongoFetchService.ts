import { Collection } from 'mongodb';
import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { AggregateBuilder } from '../../../../shared/infrastructure/persistence/mongo/AggregateBuilder';
import { Entity } from './Entity';

export class MongoFetchService {
  public static async fetch<T extends Entity>({
    collection,
    id,
    options
  }: {
    collection: Collection;
    id?: string;
    options: Partial<RequestOptions>;
  }): Promise<T[]> {
    if (!Object.keys(options).length) {
      return await collection.find<T>({}).toArray();
    }

    const aggregateBuilder = new AggregateBuilder();
    const pipeline = aggregateBuilder.buildPipeline(id ?? '', options);

    return (await collection.aggregate(pipeline).toArray()) as T[];
  }
}
