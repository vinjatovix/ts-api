import { Book } from '../domain/Book';
import { BookRepository } from '../domain/BookRepository';
import { BookCreatorRequest } from './BookCreatorRequest';
import { Uuid } from '../../../shared/domain/value-object/Uuid';
import { BookTitle } from '../domain/BookTitle';
import { Isbn } from '../domain/ISBN';
import { BookAuthor } from '../domain/BookAuthor';
import { BookReleaseDate } from '../domain/BookReleaseDate';
import { BookPages } from '../domain/BookPages';
import { LogRepository } from '../../../shared/Logs/domain/LogRepository';
import { Log } from '../../../shared/Logs/domain/Log';
import { LogLevel } from '../../../shared/Logs/domain/LogLevel';

export class BookCreator {
  private readonly repository: BookRepository;
  private readonly logRepository: LogRepository;

  constructor(repository: BookRepository, logRepository: LogRepository) {
    this.repository = repository;
    this.logRepository = logRepository;
  }

  async run(request: BookCreatorRequest): Promise<void> {
    const book = new Book({
      id: new Uuid(request.id),
      title: new BookTitle(request.title),
      author: new BookAuthor(request.author),
      isbn: new Isbn(request.isbn),
      releaseDate: new BookReleaseDate(request.releaseDate),
      pages: new BookPages(+request.pages)
    });

    await this.repository.save(book);
    await this.logRepository.save(
      new Log(LogLevel.INFO, `Created Book: <${book.id.value}>`)
    );
  }
}
