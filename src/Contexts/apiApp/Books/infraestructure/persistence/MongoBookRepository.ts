import { ObjectId } from 'bson';
import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces/RequestOptions';
import { Nullable } from '../../../../shared/domain/Nullable';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo/MongoRepository';

import { Book, BookPatch } from '../../domain';
import { BookRepository } from '../../domain/interfaces';
import { BookByQuery } from '../../domain/interfaces/BookByQuery';
import { PopulatedBook } from '../../domain/PopulatedBook';
import { MetadataType } from '../../../../shared/application/MetadataType';
import { Username } from '../../../Auth/domain';
import { Metadata } from '../../../../shared/domain/valueObject/Metadata';

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
    return this.persist(book.id.value, book);
  }

  public async update(book: BookPatch, username: Username): Promise<void> {
    return this.persist(book.id.value, book, username);
  }

  public async remove(id: string): Promise<void> {
    return this.delete(id);
  }

  public async search(
    id: string,
    options: Partial<RequestOptions> = {}
  ): Promise<Nullable<Partial<Book | PopulatedBook>>> {
    const collection = await this.collection();

    if (Object.keys(options).length === 0) {
      const document = await collection.findOne<BookDocument>({
        _id: id as unknown as ObjectId
      });

      return document
        ? Book.fromPrimitives({
            id: document._id,
            title: document.title,
            author: document.author,
            isbn: document.isbn,
            releaseDate: document.releaseDate,
            pages: document.pages,
            metadata: document.metadata
          })
        : null;
    }

    const pipeline: object[] = [{ $match: { _id: id } }];
    const lookUps = this.getPopulateOptions(id, options.include ?? []);
    const projections = this.getFieldsProjection(
      options.fields ?? [],
      options.include ?? []
    );

    pipeline.push(...lookUps, ...projections);

    const documents = await collection.aggregate(pipeline).toArray();

    return documents.length > 0
      ? PopulatedBook.fromPrimitives({
          id: documents[0]._id,
          title: documents[0].title,
          ...(documents[0].author && {
            author: {
              id: documents[0].author[0]?._id,
              name: documents[0].author[0]?.name,
              metadata: documents[0].author[0]?.metadata
            }
          }),
          isbn: documents[0]?.isbn,
          releaseDate: documents[0].releaseDate,
          pages: documents[0].pages,
          metadata: Metadata.fromPrimitives(documents[0].metadata)
        })
      : null;
  }

  private getPopulateOptions(id: string, include: string[]) {
    const lookups = (include ?? [])
      .map((includeField) => ({
        $lookup: {
          from: `${includeField}s`,
          localField: includeField,
          foreignField: '_id',
          as: includeField
        }
      }))
      .filter((lookup) => lookup !== null) as object[];

    return lookups;
  }

  private getFieldsProjection(fields: string[], include: string[]) {
    const idsToInclude = this.getRelatedCollectionIdsToInclude(include);

    return fields.length > 0
      ? [
          {
            $project: fields.reduce(
              (acc, field) => ({ ...acc, [field]: 1 }),
              idsToInclude
            )
          }
        ]
      : [];
  }

  private getRelatedCollectionIdsToInclude(include: string[]) {
    return include.reduce(
      (acc: { [key: string]: number }, field) => {
        const isNestedField = field.includes('.');

        if (!isNestedField) {
          acc[`${field}._id`] = 1;
        } else {
          const parentField = field.split('.')[0];
          const parentFieldIdKey = `${parentField}._id`;
          const parentFieldMetadataKey = `${parentField}.metadata`;
          acc[parentFieldIdKey] = 1;
          acc[parentFieldMetadataKey] = 1;
        }

        return acc;
      },
      { _id: 1, metadata: 1 }
    );
  }

  public async findAll(
    options: Partial<RequestOptions> = {}
  ): Promise<Book[] | PopulatedBook[]> {
    const collection = await this.collection();
    if (Object.keys(options).length === 0) {
      const documents = await collection.find<BookDocument>({}).toArray();

      return documents.map((document) =>
        Book.fromPrimitives({
          id: document._id,
          title: document.title,
          author: document.author,
          isbn: document.isbn,
          releaseDate: document.releaseDate,
          pages: document.pages,
          metadata: Metadata.fromPrimitives(document.metadata)
        })
      );
    }

    const pipeline: object[] = [];
    const lookUps = this.getPopulateOptions('', options.include ?? []);
    const projections = this.getFieldsProjection(
      options.fields ?? [],
      options.include ?? []
    );

    pipeline.push(...lookUps, ...projections);

    const documents = await collection.aggregate(pipeline).toArray();

    return documents.map((document) => {
      const author = document.author[0];

      return PopulatedBook.fromPrimitives({
        id: document._id,
        title: document.title,
        isbn: document.isbn,
        releaseDate: document.releaseDate,
        pages: document.pages,
        metadata: document.metadata,
        ...(author && {
          author: {
            id: author._id,
            name: author.name,
            metadata: author.metadata
          }
        })
      });
    });
  }

  public async findByQuery(query: BookByQuery): Promise<Book[]> {
    const collection = await this.collection();
    const documents = await collection.find<BookDocument>(query).toArray();

    return documents.map((document) =>
      Book.fromPrimitives({
        id: document._id,
        title: document.title,
        author: document.author,
        isbn: document.isbn,
        releaseDate: document.releaseDate,
        pages: document.pages,
        metadata: document.metadata
      })
    );
  }

  protected collectionName(): string {
    return 'books';
  }
}
