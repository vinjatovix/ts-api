import { MongoClient, ObjectId } from 'mongodb';
import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo';
import { Nullable } from '../../../../shared/domain/types';
import { Username } from '../../../Auth/domain';
import { BookByQuery } from '../../application/interfaces';
import { Book, BookPatch, PopulatedBook } from '../../domain';
import { BookRepository } from '../../domain/interfaces';
import { BookMapper } from '../BookMapper';
import { BookType, PopulatedBookType } from '../types';

export class MongoBookRepository
  extends MongoRepository<Book | BookPatch>
  implements BookRepository
{
  constructor(
    client: Promise<MongoClient>,
    private readonly mapper: BookMapper
  ) {
    super(client);
    this.mapper = new BookMapper();
  }

  public async save(book: Book): Promise<void> {
    return await this.persist(book.id.value, book);
  }

  public async update(book: BookPatch, username: Username): Promise<void> {
    return await this.persist(book.id.value, book, username);
  }

  public async remove(id: string): Promise<void> {
    return this.delete(id);
  }

  public async search(
    id: string,
    options: Partial<RequestOptions> = {}
  ): Promise<Nullable<Partial<Book | PopulatedBook>>> {
    if (!Object.keys(options).length) {
      const collection = await this.collection();
      const document = await collection.findOne<BookType>({
        _id: id as unknown as ObjectId
      });

      return document ? this.mapper.toDomain(document) : null;
    }

    const documents = await this.fetch<PopulatedBookType>({ id, options });

    return documents.length ? this.mapper.map(documents[0]) : null;
  }

  public async findAll(
    options: Partial<RequestOptions> = {}
  ): Promise<Book[] | PopulatedBook[]> {
    if (!Object.keys(options).length) {
      const collection = await this.collection();
      const documents = await collection.find<BookType>({}).toArray();

      return documents.map(this.mapper.toDomain);
    }

    const documents = await this.fetch<PopulatedBookType>({ options });

    return options.include
      ? documents.map(this.mapper.toPopulatedDomain)
      : documents.map(this.mapper.toDomain);
  }

  public async findByQuery(query: BookByQuery): Promise<Book[]> {
    const collection = await this.collection();
    const documents = await collection.find<BookType>(query).toArray();

    return documents.map(this.mapper.toDomain);
  }

  protected collectionName(): string {
    return 'books';
  }
}
