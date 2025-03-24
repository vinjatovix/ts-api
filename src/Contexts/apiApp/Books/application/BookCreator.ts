import { InvalidArgumentError } from '../../../shared/domain/errors/InvalidArgumentError';
import { NotFoundError } from '../../../shared/domain/errors/NotFoundError';
import { Uuid } from '../../../shared/domain/value-object/Uuid';
import { buildLogger } from '../../../shared/plugins/logger.plugin';
import { AuthorRepository } from '../../Authors/domain';

import {
  Book,
  BookAuthor,
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
  private readonly authorRepository: AuthorRepository;

  constructor(repository: BookRepository, authorRepository: AuthorRepository) {
    this.repository = repository;
    this.authorRepository = authorRepository;
  }

  async run(request: BookCreatorRequest): Promise<void> {
    const storedBook = await this.repository.search(request.id);

    if (storedBook) {
      throw new InvalidArgumentError(`Book <${request.id}> already exists`);
    }
    const author = await this.authorRepository.search(request.author);
    if (!author) {
      throw new NotFoundError(`Author <${request.author}>`);
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
    logger.info(`Created Book: <${book.id.value}> `);
  }
}
