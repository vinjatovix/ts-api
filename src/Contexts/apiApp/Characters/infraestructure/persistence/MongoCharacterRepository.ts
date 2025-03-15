import { ObjectId } from 'mongodb';
import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { Nullable } from '../../../../shared/domain/Nullable';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo';
import { Username } from '../../../Auth/domain';
import { CharacterByQuery } from '../../application/interfaces';
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

    const documents = await this.fetch<PopulatedCharacterType>({ options });

    return documents.map(CharacterMapper.toPopulatedDomain);
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
    const documents = await this.fetch<PopulatedCharacterType>({ id, options });

    return documents.length > 0
      ? CharacterMapper.toPopulatedDomain(documents[0])
      : null;
  }

  protected collectionName(): string {
    return 'characters';
  }

  public async remove(id: string): Promise<void> {
    return this.delete(id);
  }
}
