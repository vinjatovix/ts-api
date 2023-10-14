import { Book } from '../domain/Book';
import { BookRepository } from '../domain/BookRepository';

export class BookCreator {
  constructor(private repository: BookRepository) {}

  async run(
    id: string,
    title: string,
    author: string,
    isbn: string,
    releaseDate: string,
    pages: number
  ): Promise<void> {
    const book = new Book(id, title, author, isbn, releaseDate, pages);

    return this.repository.save(book);
  }
}
