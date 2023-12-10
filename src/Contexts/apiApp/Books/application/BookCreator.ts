import { Book } from '../domain/Book';
import { BookRepository } from '../domain/BookRepository';
import { BookCreatorRequest } from './BookCreatorRequest';
import { Uuid } from '../../../shared/domain/value-object/Uuid';
import { BookTitle } from '../domain/BookTitle';
import { Isbn } from '../domain/ISBN';
import { BookAuthor } from '../domain/BookAuthor';
import { BookReleaseDate } from '../domain/BookReleaseDate';
import { BookPages } from '../domain/BookPages';
import { buildLogger } from '../../../shared/plugins/logger.plugin';
import { InvalidArgumentError } from '../../../shared/domain/errors/InvalidArgumentError';

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
      id: new Uuid(request.id),
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
