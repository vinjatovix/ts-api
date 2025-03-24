import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo/MongoRepository';

import { Author, AuthorRepository } from '../../domain';

export interface AuthorDocument {
  _id: string;
  name: string;
}

export class MongoAuthorRepository
  extends MongoRepository<Author>
  implements AuthorRepository
{
  public async save(author: Author): Promise<void> {
    return this.persist(author.id.value, author);
  }

  public async update(author: Author): Promise<void> {
    return this.persist(author.id.value, author);
  }

  public async remove(id: string): Promise<void> {
    return this.delete(id);
  }

  public async search(id: string): Promise<Author | null> {
    const collection = await this.collection();
    const document = await collection.findOne<AuthorDocument>({ _id: id });

    return document
      ? Author.fromPrimitives({
          id: document._id,
          name: document.name
        })
      : null;
  }

  public async findAll(): Promise<Author[]> {
    const collection = await this.collection();
    const documents = await collection.find<AuthorDocument>({}).toArray();

    return documents.map((document) =>
      Author.fromPrimitives({
        id: document._id,
        name: document.name
      })
    );
  }

  protected collectionName(): string {
    return 'authors';
  }
}
