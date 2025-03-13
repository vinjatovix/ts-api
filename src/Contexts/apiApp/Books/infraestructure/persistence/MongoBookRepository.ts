import { ObjectId } from 'bson';
import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces/RequestOptions';
import { Nullable } from '../../../../shared/domain/Nullable';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo/MongoRepository';
import { Book, BookPatch } from '../../domain';
import { BookRepository } from '../../domain/interfaces';
import { BookByQuery } from '../../domain/interfaces/BookByQuery';
import { PopulatedBook } from '../../domain/PopulatedBook';
import { Username } from '../../../Auth/domain';
import { MetadataType } from '../../../../shared/application/MetadataType';
import { Collection, MongoServerError } from 'mongodb';
import { MongoErrorHandler } from '../../../../shared/infrastructure/persistence/mongo';
import { BookType, PopulatedBookType } from '../types';
import { BookMapper } from '../BookMapper';
import { AggregateBuilder } from '../../../../shared/infrastructure/persistence/mongo/AggregateBuilder';

export interface BookDocument {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  releaseDate: string;
  pages: number;
  metadata: MetadataType;
}

export class MongoBookRepository
  extends MongoRepository<Book | BookPatch>
  implements BookRepository
{
  public async save(book: Book): Promise<void> {
    try {
      return await this.persist(book.id.value, book);
    } catch (err: unknown) {
      if (err as MongoServerError) {
        MongoErrorHandler.formatError(err as MongoServerError);
      }
      throw err;
    }
  }

  public async update(book: BookPatch, username: Username): Promise<void> {
    try {
      return await this.persist(book.id.value, book, username);
    } catch (err: unknown) {
      if (err as MongoServerError) {
        MongoErrorHandler.formatError(err as MongoServerError);
      }
      throw err;
    }
  }

  public async remove(id: string): Promise<void> {
    return this.delete(id);
  }

  public async search(
    id: string,
    options: Partial<RequestOptions> = {}
  ): Promise<Nullable<Partial<Book | PopulatedBook>>> {
    try {
      const collection = await this.collection();

      if (!Object.keys(options).length) {
        const document = await collection.findOne<BookType>({
          _id: id as unknown as ObjectId
        });

        return document ? BookMapper.toDomain(document) : null;
      }

      const documents = await this.fetch({ collection, id, options });

      return documents.length > 0
        ? BookMapper.toPopulatedDomain(documents[0])
        : null;
    } catch (err: unknown) {
      if (err as MongoServerError) {
        MongoErrorHandler.formatError(err as MongoServerError);
      }
      throw err;
    }
  }

  public async findAll(
    options: Partial<RequestOptions> = {}
  ): Promise<Book[] | PopulatedBook[]> {
    const collection = await this.collection();

    if (!Object.keys(options).length) {
      const documents = await collection.find<BookType>({}).toArray();

      return documents.map(BookMapper.toDomain);
    }

    const documents = await this.fetch({ collection, options });

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

  private async fetch({
    collection,
    id,
    options
  }: {
    collection: Collection;
    id?: string;
    options: Partial<RequestOptions>;
  }): Promise<PopulatedBookType[]> {
    const aggregateBuilder = new AggregateBuilder();
    const pipeline = aggregateBuilder.buildPipeline(id ?? '', options);

    return (await collection
      .aggregate(pipeline)
      .toArray()) as PopulatedBookType[];
  }
}
