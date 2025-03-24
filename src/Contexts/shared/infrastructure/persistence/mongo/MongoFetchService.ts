import { Collection } from 'mongodb';
import {
  AggregateBuilder,
  AggregationOptions
} from '../../../../shared/infrastructure/persistence/mongo';
import { Entity } from './types';

export class MongoFetchService {
  public static async fetch<T extends Entity>({
    collection,
    id,
    options
  }: {
    collection: Collection;
    id?: string;
    options: AggregationOptions;
  }): Promise<T[]> {
    if (!Object.keys(options).length) {
      return await collection.find<T>({}).toArray();
    }

    const aggregateBuilder = new AggregateBuilder();
    const pipeline = aggregateBuilder.buildPipeline(id ?? '', options);

    return (await collection.aggregate(pipeline).toArray()) as T[];
  }
}
