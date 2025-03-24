import { RequestById } from '../../../shared/application/interfaces';
import { buildLogger } from '../../../shared/plugins';
import { BookRepository } from '../domain/interfaces';

const logger = buildLogger('bookRemover');

export class BookRemover {
  private readonly repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async run(request: RequestById, username: string): Promise<void> {
    await this.repository.remove(request.id);

    logger.info(`Removed Book: <${request.id}> by <${username}>`);
  }
}
