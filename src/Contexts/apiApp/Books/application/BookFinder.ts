import { RequestById } from '../../../shared/application/RequestById';
import { NotFoundError } from '../../../shared/domain/value-object/NotFoundError';
import { BookRepository } from '../domain/BookRepository';
import { BookResponse } from './BookResponse';

export class BookFinder {
  private readonly repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async run(request: RequestById): Promise<BookResponse> {
    const book = await this.repository.search(request.id);

    if (book === null) {
      throw new NotFoundError(`Book <${request.id}> not found`);
    }

    return {
      id: book.id.value,
      title: book.title.value,
      author: book.author.value,
      isbn: book.isbn.value,
      releaseDate: book.releaseDate.value,
      pages: book.pages.value
    };
  }
}
