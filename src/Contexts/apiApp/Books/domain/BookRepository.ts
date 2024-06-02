import { Book } from './Book';
import { BookByQuery } from './BookByQuery';
import { BookPatch } from './BookPatch';

export interface BookRepository {
  save(book: Book): Promise<void>;

  update(book: BookPatch): Promise<void>;

  search(bookId: string): Promise<Book | null>;

  findAll(): Promise<Book[]>;

  remove(bookId: string): Promise<void>;

  findByQuery(query: BookByQuery): Promise<Book[]>;
}
