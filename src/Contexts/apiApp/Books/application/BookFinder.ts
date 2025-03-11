import { RequestOptions } from '../../../../apps/apiApp/shared/interfaces/RequestOptions';
import { RequestById } from '../../../shared/application/interfaces';
import { createError } from '../../../shared/domain/errors';
import { Book, PopulatedBook } from '../domain';
import { BookPrimitives, BookRepository } from '../domain/interfaces';

export class BookFinder {
  constructor(private readonly repository: BookRepository) {}

  async run(
    { id }: RequestById,
    options: Partial<RequestOptions> = {}
  ): Promise<Partial<BookPrimitives>> {
    const book = (await this.repository.search(id, options)) as
      | Book
      | PopulatedBook;

    if (!book) {
      throw createError.notFound(`Book <${id}>`);
    }

    return book.toPrimitives();
  }
}
