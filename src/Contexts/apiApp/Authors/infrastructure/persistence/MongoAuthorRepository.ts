import { ObjectId } from 'mongodb';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo/MongoRepository';

import { Author, AuthorPatch, AuthorRepository } from '../../domain';
import { Username } from '../../../Auth/domain';
import { MetadataType } from '../../../../shared/application/MetadataType';

export interface AuthorDocument {
  _id: string;
  name: string;
  metadata: MetadataType;
}

export class MongoAuthorRepository
  extends MongoRepository<Author>
  implements AuthorRepository
{
  public async save(author: Author): Promise<void> {
    return this.persist(author.id.value, author);
  }

  public async update(author: AuthorPatch, username: Username): Promise<void> {
    return this.persist(author.id.value, author as Author, username);
  }

  public async remove(id: string): Promise<void> {
    return this.delete(id);
  }

  public async search(id: string): Promise<Author | null> {
    const collection = await this.collection();
    const document = await collection.findOne<AuthorDocument>({
      _id: id as unknown as ObjectId
    });

    return document
      ? Author.fromPrimitives({
          id: document._id,
          name: document.name,
          metadata: document.metadata
        })
      : null;
  }

  public async findAll(): Promise<Author[]> {
    const collection = await this.collection();
    const documents = await collection.find<AuthorDocument>({}).toArray();

    return documents.map((document) =>
      Author.fromPrimitives({
        id: document._id,
        name: document.name,
        metadata: document.metadata
      })
    );
  }

  protected collectionName(): string {
    return 'authors';
  }
}
