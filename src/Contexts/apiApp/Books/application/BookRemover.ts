import { buildLogger } from '../../../shared/plugins/logger.plugin';

import { BookRepository } from '../domain';

import { BookRemoverRequest } from './BookRemoverRequest';

const logger = buildLogger('bookRemover');
export class BookRemover {
  private readonly repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async run(request: BookRemoverRequest): Promise<void> {
    await this.repository.remove(request.id);
    logger.info(`Removed Book: <${request.id}>`);
  }
}
