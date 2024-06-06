import { BookRepository } from '../../Books/domain/interfaces';
import { RequestById } from '../../../shared/application/RequestById';
import { ConflictError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins';
import { AuthorRepository } from '../domain';

const logger = buildLogger('authorRemover');

export class AuthorRemover {
  private readonly repository: AuthorRepository;
  private readonly bookRepository: BookRepository;

  constructor(repository: AuthorRepository, bookRepository: BookRepository) {
    this.repository = repository;
    this.bookRepository = bookRepository;
  }

  async run(request: RequestById, username: string): Promise<void> {
    const books = await this.bookRepository.findByQuery(
      {
        author: request.id
      },
      { fields: ['id'] }
    );

    if (books.length > 0) {
      throw new ConflictError(`Author <${request.id}> has books`);
    }

    await this.repository.remove(request.id);
    logger.info(`Removed Author: <${request.id}> by <${username}>`);
  }
}
