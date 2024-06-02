import { buildLogger } from '../../../shared/plugins/logger.plugin';
import { AuthorRepository } from '../domain';
import { BookRepository } from '../../Books/domain/BookRepository';
import { ConflictError } from '../../../shared/domain/errors/ConflictError';
import { RequestById } from '../../../shared/application/RequestById';

const logger = buildLogger('authorRemover');

export class AuthorRemover {
  private readonly repository: AuthorRepository;
  private readonly bookRepository: BookRepository;

  constructor(repository: AuthorRepository, bookRepository: BookRepository) {
    this.repository = repository;
    this.bookRepository = bookRepository;
  }

  async run(request: RequestById): Promise<void> {
    const books = await this.bookRepository.findByQuery({
      author: request.id
    });
    if (books.length > 0) {
      throw new ConflictError(`Author <${request.id}> has books`);
    }
    await this.repository.remove(request.id);
    logger.info(`Removed Author: <${request.id}>`);
  }
}
