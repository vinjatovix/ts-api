import { createError } from '../../../shared/domain/errors';
import { Uuid } from '../../../shared/domain/valueObject';
import { Metadata } from '../../../shared/domain/valueObject/Metadata';
import { buildLogger } from '../../../shared/plugins';
import { AuthorRepository } from '../../Authors/domain';
import { Book, BookPages, BookReleaseDate, BookTitle, Isbn } from '../domain';
import { BookRepository } from '../domain/interfaces';
import { BookCreatorRequest } from './BookCreatorRequest';

const logger = buildLogger('bookCreator');

export class BookCreator {
  private readonly repository: BookRepository;
  private readonly authorRepository: AuthorRepository;

  constructor(repository: BookRepository, authorRepository: AuthorRepository) {
    this.repository = repository;
    this.authorRepository = authorRepository;
  }

  async run(request: BookCreatorRequest, username: string): Promise<void> {
    await this.validateDependencies(request);

    const book = new Book({
      id: new Uuid(request.id),
      title: new BookTitle(request.title),
      author: new Uuid(request.author),
      isbn: new Isbn(request.isbn),
      releaseDate: new BookReleaseDate(request.releaseDate),
      pages: new BookPages(+request.pages),
      metadata: new Metadata({
        createdAt: new Date(),
        createdBy: username,
        updatedAt: new Date(),
        updatedBy: username
      })
    });

    await this.repository.save(book);
    logger.info(`Created Book: <${book.id.value}> by <${username}>`);
  }

  private async validateDependencies(
    request: BookCreatorRequest
  ): Promise<void> {
    const storedBook = await this.repository.search(request.id);
    if (storedBook) {
      throw createError.invalidArgument(`Book <${request.id}> already exists`);
    }
    const author = await this.authorRepository.search(request.author);
    if (!author) {
      throw createError.notFound(`Author <${request.author}>`);
    }
  }
}
