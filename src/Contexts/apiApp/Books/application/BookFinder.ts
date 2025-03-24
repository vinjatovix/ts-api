import { RequestOptions } from '../../../../apps/apiApp/shared/interfaces/RequestOptions';
import { RequestById } from '../../../shared/application/RequestById';
import { Nullable } from '../../../shared/domain/Nullable';
import { NotFoundError } from '../../../shared/domain/errors/NotFoundError';
import { Book, PopulatedBook } from '../domain';
import { BookRepository } from '../domain/interfaces';
import { BookResponse } from './BookResponse';

export class BookFinder {
  private readonly repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async run(
    request: RequestById,
    options: Partial<RequestOptions> = {}
  ): Promise<Partial<BookResponse>> {
    const book: Nullable<Partial<Book | PopulatedBook>> =
      await this.repository.search(request.id, options);

    if (book instanceof Book || book instanceof PopulatedBook) {
      return book.toPrimitives();
    }

    throw new NotFoundError(`Book <${request.id}>`);
  }
}
