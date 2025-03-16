import { MongoClient, ObjectId } from 'mongodb';
import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { Nullable } from '../../../../shared/domain/types';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo';
import { Username } from '../../../Auth/domain';
import { CharacterByQuery } from '../../application/interfaces';
import { Character, PopulatedCharacter, CharacterPatch } from '../../domain';
import { CharacterRepository } from '../../domain/interfaces';
import { CharacterType, PopulatedCharacterType } from '../types';
import { CharacterMapper } from '../CharacterMapper';

export class MongoCharacterRepository
  extends MongoRepository<Character | CharacterPatch>
  implements CharacterRepository
{
  constructor(
    client: Promise<MongoClient>,
    private readonly mapper: CharacterMapper
  ) {
    super(client);
    this.mapper = new CharacterMapper();
  }
  public async save(character: Character): Promise<void> {
    return await this.persist(character.id.value, character);
  }

  public async update(
    character: CharacterPatch,
    username: Username
  ): Promise<void> {
    return await this.persist(character.id.value, character, username);
  }

  public async findByQuery(query: CharacterByQuery): Promise<Character[]> {
    const collection = await this.collection();
    const documents = await collection.find<CharacterType>(query).toArray();

    return documents.map(this.mapper.toDomain);
  }

  public async findAll(
    options: Partial<RequestOptions> = {}
  ): Promise<Character[] | PopulatedCharacter[]> {
    if (!Object.keys(options).length) {
      const collection = await this.collection();
      const documents = await collection.find<CharacterType>({}).toArray();

      return documents.map(this.mapper.toDomain);
    }

    const documents = await this.fetch<PopulatedCharacterType>({ options });

    return options.include
      ? documents.map(this.mapper.toPopulatedDomain)
      : documents.map(this.mapper.toDomain);
  }

  public async search(
    id: string,
    options: Partial<RequestOptions> = {}
  ): Promise<Nullable<Partial<Character | PopulatedCharacter>>> {
    if (!Object.keys(options).length) {
      const collection = await this.collection();
      const document = await collection.findOne<CharacterType>({
        _id: id as unknown as ObjectId
      });

      return document ? this.mapper.toDomain(document) : null;
    }
    const documents = await this.fetch<PopulatedCharacterType>({ id, options });

    return documents.length > 0
      ? this.mapper.toPopulatedDomain(documents[0])
      : null;
  }

  protected collectionName(): string {
    return 'characters';
  }

  public async remove(id: string): Promise<void> {
    return this.delete(id);
  }
}
