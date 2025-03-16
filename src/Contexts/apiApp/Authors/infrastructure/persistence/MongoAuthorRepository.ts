import { ObjectId } from 'mongodb';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo';
import { Username } from '../../../Auth/domain';
import { Author, AuthorPatch } from '../../domain';
import { AuthorRepository } from '../../domain/interfaces';
import { AuthorType } from '../types';

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
    const document = await collection.findOne<AuthorType>({
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
    const documents = await collection.find<AuthorType>({}).toArray();

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
