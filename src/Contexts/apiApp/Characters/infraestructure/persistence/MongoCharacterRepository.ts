import { ObjectId } from 'bson';
import { Collection, MongoServerError } from 'mongodb';
import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { Nullable } from '../../../../shared/domain/Nullable';
import {
  MongoRepository,
  AggregateBuilder,
  MongoErrorHandler
} from '../../../../shared/infrastructure/persistence/mongo';
import { Username } from '../../../Auth/domain';
import { CharacterByQuery } from '../../application';
import { Character, PopulatedCharacter } from '../../domain/';
import { CharacterPatch } from '../../domain/CharacterPatch';
import { CharacterRepository } from '../../domain/interfaces';
import { CharacterType, PopulatedCharacterType } from '../types';
import { CharacterMapper } from './CharacterMapper';

export class MongoCharacterRepository
  extends MongoRepository<Character | CharacterPatch>
  implements CharacterRepository
{
  public async save(character: Character): Promise<void> {
    return this.persist(character.id.value, character);
  }

  public async update(
    character: CharacterPatch,
    username: Username
  ): Promise<void> {
    try {
      return await this.persist(character.id.value, character, username);
    } catch (err: unknown) {
      if (err as MongoServerError) {
        MongoErrorHandler.formatError(err as MongoServerError);
      }
      throw err;
    }
  }

  public async findByQuery(query: CharacterByQuery): Promise<Character[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (query.id || (query.book && query.name)) {
      filter.$or = [];

      if (query.id) {
        filter.$or.push({ _id: query.id });
      }

      if (query.book && query.name) {
        filter.$or.push({ book: query.book, name: query.name });
      }
    }
    const collection = await this.collection();
    const documents = await collection.find<CharacterType>(filter).toArray();

    return documents.map(CharacterMapper.toDomain);
  }

  public async findAll(
    options: Partial<RequestOptions> = {}
  ): Promise<Character[] | PopulatedCharacter[]> {
    const collection = await this.collection();
    if (Object.keys(options).length === 0) {
      const documents = await collection.find<CharacterType>({}).toArray();

      return documents.map(CharacterMapper.toDomain);
    }

    const documents = await this.fetch({ collection, options });

    return documents.map((document) =>
      CharacterMapper.toPopulatedDomain(document)
    );
  }

  public async search(
    id: string,
    options: Partial<RequestOptions> = {}
  ): Promise<Nullable<Character | PopulatedCharacter>> {
    const collection = await this.collection();

    if (!Object.keys(options).length) {
      const document = await collection.findOne<CharacterType>({
        _id: id as unknown as ObjectId
      });

      return document ? CharacterMapper.toDomain(document) : null;
    }

    const documents = await this.fetch({ id, collection, options });

    return documents.length > 0
      ? CharacterMapper.toPopulatedDomain(documents[0])
      : null;
  }

  protected collectionName(): string {
    return 'characters';
  }

  private async fetch({
    collection,
    id,
    options
  }: {
    collection: Collection;
    id?: string;
    options: Partial<RequestOptions>;
  }): Promise<PopulatedCharacterType[]> {
    const aggregateBuilder = new AggregateBuilder<PopulatedCharacterType>();
    const pipeline = aggregateBuilder.buildPipeline(id ?? '', options);

    return (await collection
      .aggregate(pipeline)
      .toArray()) as PopulatedCharacterType[];
  }

  public async remove(id: string): Promise<void> {
    return this.delete(id);
  }
}
