import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces/RequestOptions';
import { Book } from '../Book';
import { BookByQuery } from './BookByQuery';
import { BookPatch } from '../BookPatch';
import { PopulatedBook } from '../PopulatedBook';
import { Username } from '../../../Auth/domain';

export interface BookRepository {
  save(book: Book): Promise<void>;

  update(book: BookPatch, user: Username): Promise<void>;

  search(
    bookId: string,
    options?: Partial<RequestOptions>
  ): Promise<Partial<Book | PopulatedBook> | null>;

  findAll(options?: Partial<RequestOptions>): Promise<Book[] | PopulatedBook[]>;

  remove(bookId: string): Promise<void>;

  findByQuery(
    query: BookByQuery,
    options?: Partial<RequestOptions>
  ): Promise<Book[]>;
}
