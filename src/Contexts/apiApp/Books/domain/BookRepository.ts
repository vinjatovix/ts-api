import { Book } from './Book';

export interface BookRepository {
  save(book: Book): Promise<void>;

  search(bookId: string): Promise<Book | null>;

  findAll(): Promise<Book[]>;

  remove(bookId: string): Promise<void>;
}
