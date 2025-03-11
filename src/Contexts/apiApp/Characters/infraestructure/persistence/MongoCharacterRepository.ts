import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo/MongoRepository';
import { Character } from '../../domain';
import { CharacterRepository } from '../../domain/interfaces';
import { Nullable } from '../../../../shared/domain/Nullable';
import { ObjectId } from 'bson';
import { MetadataType } from '../../../../shared/application/MetadataType';
import { CharacterByQuery } from '../../application';

export interface CharacterDocument {
  _id: string;
  name: string;
  book: string;
  metadata: MetadataType;
}

export class MongoCharacterRepository
  extends MongoRepository<Character>
  implements CharacterRepository
{
  public async save(character: Character): Promise<void> {
    return this.persist(character.id.value, character);
  }

  public async findById(id: string): Promise<Nullable<Character>> {
    const collection = await this.collection();

    const document = await collection.findOne<CharacterDocument>({
      _id: id as unknown as ObjectId
    });

    return document
      ? Character.fromPrimitives({
          id: document._id,
          name: document.name,
          book: document.book,
          metadata: document.metadata
        })
      : null;
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
    const documents = await collection
      .find<CharacterDocument>(filter)
      .toArray();

    return documents.map((document) =>
      Character.fromPrimitives({
        id: document._id,
        name: document.name,
        book: document.book,
        metadata: document.metadata
      })
    );
  }

  protected collectionName(): string {
    return 'characters';
  }
}
