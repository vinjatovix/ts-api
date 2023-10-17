import { Book } from './Book';

export interface BookRepository {
  save(book: Book): Promise<void>;

  search(bookId: string): Promise<Book | null>;

  remove(bookId: string): Promise<void>;
}
