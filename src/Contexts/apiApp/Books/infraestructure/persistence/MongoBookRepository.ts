import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces/RequestOptions';
import { Nullable } from '../../../../shared/domain/Nullable';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo/MongoRepository';
import { Book, BookPatch } from '../../domain';
import { BookRepository } from '../../domain/interfaces';
import { BookByQuery } from '../../domain/interfaces/BookByQuery';
import { PopulatedBook } from '../../domain/PopulatedBook';
import { Username } from '../../../Auth/domain';
import { ObjectId } from 'mongodb';
import { BookType, PopulatedBookType } from '../types';
import { BookMapper } from '../BookMapper';

export class MongoBookRepository
  extends MongoRepository<Book | BookPatch>
  implements BookRepository
{
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

      return document ? BookMapper.toDomain(document) : null;
    }

    const documents = await this.fetch<PopulatedBookType>({ id, options });

    return documents.length > 0
      ? (BookMapper.map(documents[0]) as PopulatedBook)
      : null;
  }

  public async findAll(
    options: Partial<RequestOptions> = {}
  ): Promise<Book[] | PopulatedBook[]> {
    if (!Object.keys(options).length) {
      const collection = await this.collection();
      const documents = await collection.find<BookType>({}).toArray();

      return documents.map(BookMapper.toDomain);
    }

    const documents = await this.fetch<PopulatedBookType>({ options });

    return documents.map(BookMapper.toPopulatedDomain);
  }

  public async findByQuery(query: BookByQuery): Promise<Book[]> {
    const collection = await this.collection();
    const documents = await collection.find<BookType>(query).toArray();

    return documents.map(BookMapper.toDomain);
  }

  protected collectionName(): string {
    return 'books';
  }
}
