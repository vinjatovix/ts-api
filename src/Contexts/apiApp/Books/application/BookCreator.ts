import { Book } from '../domain/Book';
import { BookRepository } from '../domain/BookRepository';
import { BookCreatorRequest } from './BookCreatorRequest';
import { Uuid } from '../../../shared/domain/value-object/Uuid';
import { BookTitle } from '../domain/BookTitle';
import { ISBN } from '../domain/ISBN';
import { BookAuthor } from '../domain/BookAuthor';
import { BookReleaseDate } from '../domain/BookReleaseDate';

export class BookCreator {
  private readonly repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async run(request: BookCreatorRequest): Promise<void> {
    const book = new Book({
      id: new Uuid(request.id),
      title: new BookTitle(request.title),
      author: new BookAuthor(request.author),
      isbn: new ISBN(request.isbn),
      releaseDate: new BookReleaseDate(request.releaseDate),
      pages: request.pages
    });

    return this.repository.save(book);
  }
}
