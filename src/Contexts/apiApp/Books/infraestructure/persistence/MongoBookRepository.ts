import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces/RequestOptions';
import { Nullable } from '../../../../shared/domain/Nullable';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo/MongoRepository';

import { Book, BookPatch } from '../../domain';
import { BookRepository } from '../../domain/interfaces';
import { BookByQuery } from '../../domain/interfaces/BookByQuery';
import { PopulatedBook } from '../../domain/PopulatedBook';

export interface BookDocument {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  releaseDate: string;
  pages: number;
}

export class MongoBookRepository
  extends MongoRepository<Book | BookPatch>
  implements BookRepository
{
  public async save(book: Book): Promise<void> {
    return this.persist(book.id.value, book);
  }

  public async update(book: BookPatch): Promise<void> {
    return this.patch(book);
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
      const document = await collection.findOne<BookDocument>({ _id: id });

      return document
        ? Book.fromPrimitives({
            id: document._id,
            title: document.title,
            author: document.author,
            isbn: document.isbn,
            releaseDate: document.releaseDate,
            pages: document.pages
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
              name: documents[0].author[0]?.name
            }
          }),
          isbn: documents[0]?.isbn,
          releaseDate: documents[0].releaseDate,
          pages: documents[0].pages
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
          acc[field] = 1;
        } else {
          const parentField = field.split('.')[0];
          const parentFieldIdKey = `${parentField}._id`;
          acc[parentFieldIdKey] = 1;
        }

        return acc;
      },
      { _id: 1 }
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
          pages: document.pages
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

    return documents.map((document) =>
      PopulatedBook.fromPrimitives({
        id: document._id,
        title: document.title,
        ...(document.author && {
          author: {
            id: document.author[0]?._id,
            name: document.author[0]?.name
          }
        }),
        isbn: document.isbn,
        releaseDate: document.releaseDate,
        pages: document.pages
      })
    );
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
        pages: document.pages
      })
    );
  }

  protected collectionName(): string {
    return 'books';
  }
}
