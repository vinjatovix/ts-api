import { Book } from '../domain/Book';
import { BookRepository } from '../domain/BookRepository';
import { BookCreatorRequest } from './BookCreatorRequest';
import { Uuid } from '../../../shared/domain/value-object/Uuid';

export class BookCreator {
  private readonly repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async run(request: BookCreatorRequest): Promise<void> {
    const book = new Book({
      id: new Uuid(request.id),
      title: request.title,
      author: request.author,
      isbn: request.isbn,
      releaseDate: request.releaseDate,
      pages: request.pages
    });

    return this.repository.save(book);
  }
}
