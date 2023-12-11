import { NotFoundError } from '../../../shared/domain/errors/NotFoundError';
import { buildLogger } from '../../../shared/plugins/logger.plugin';

import { BookPatch, BookRepository } from '../domain';

import { BookPatcherRequest } from './BookPatcherRequest';

const logger = buildLogger('bookPatcher');

export class BookPatcher {
  private readonly repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async run(request: BookPatcherRequest): Promise<void> {
    const storedBook = await this.repository.search(request.id);

    if (storedBook === null) {
      throw new NotFoundError(`Book <${request.id}> not found`);
    }

    const book = BookPatch.fromPrimitives(request);

    await this.repository.update(book);
    logger.info(`Updated Book: <${book.id}>`);
  }
}
