import { RequestById } from '../../../shared/application/interfaces';
import { createError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins';
import { BookRepository } from '../../Books/domain/interfaces';
import { AuthorRepository } from '../domain/interfaces';

const logger = buildLogger('authorRemover');

export class AuthorRemover {
  private readonly repository: AuthorRepository;
  private readonly bookRepository: BookRepository;

  constructor(repository: AuthorRepository, bookRepository: BookRepository) {
    this.repository = repository;
    this.bookRepository = bookRepository;
  }

  async run(request: RequestById, username: string): Promise<void> {
    await this.validateRelations(request);

    await this.repository.remove(request.id);
    logger.info(`Removed Author: <${request.id}> by <${username}>`);
  }

  private async validateRelations(request: RequestById) {
    const books = await this.bookRepository.findByQuery({ author: request.id });

    if (books.length > 0) {
      throw createError.conflict(`Author <${request.id}> has associated books`);
    }
  }
}
