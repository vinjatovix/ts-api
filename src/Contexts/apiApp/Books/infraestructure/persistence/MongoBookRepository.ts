import { Nullable } from '../../../../shared/domain/Nullable';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo/MongoRepository';

import { Book, BookPatch, BookRepository } from '../../domain';

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

  public async search(id: string): Promise<Nullable<Book>> {
    const collection = await this.collection();
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

  public async findAll(): Promise<Book[]> {
    const collection = await this.collection();
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

  protected collectionName(): string {
    return 'books';
  }
}
