import { RequestOptions } from '../../../../apps/apiApp/shared/interfaces';
import { Book, PopulatedBook } from '../domain';
import { BookPrimitives, BookRepository } from '../domain/interfaces';

export class AllBooksFinder {
  private readonly repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async run(
    options: Partial<RequestOptions> = {}
  ): Promise<Partial<BookPrimitives>[]> {
    const books: (Book | PopulatedBook)[] =
      await this.repository.findAll(options);

    return books.map((book) => book.toPrimitives());
  }
}
