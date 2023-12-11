import { InvalidArgumentError } from '../../../shared/domain/errors/InvalidArgumentError';
import { buildLogger } from '../../../shared/plugins/logger.plugin';

import {
  Book,
  BookAuthor,
  BookId,
  BookPages,
  BookReleaseDate,
  BookRepository,
  BookTitle,
  Isbn
} from '../domain';

import { BookCreatorRequest } from './BookCreatorRequest';

const logger = buildLogger('bookCreator');

export class BookCreator {
  private readonly repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async run(request: BookCreatorRequest): Promise<void> {
    const storedBook = await this.repository.search(request.id);

    if (storedBook) {
      throw new InvalidArgumentError(`Book <${request.id}> already exists`);
    }

    const book = new Book({
      id: new BookId(request.id),
      title: new BookTitle(request.title),
      author: new BookAuthor(request.author),
      isbn: new Isbn(request.isbn),
      releaseDate: new BookReleaseDate(request.releaseDate),
      pages: new BookPages(+request.pages)
    });

    await this.repository.save(book);
    logger.info(`Created Book: <${book.id.value}>`);
  }
}
