import { NotFoundError } from '../../../shared/domain/errors/NotFoundError';
import { buildLogger } from '../../../shared/plugins/logger.plugin';
import { AuthorRepository } from '../../Authors/domain';

import { BookPatch, BookRepository } from '../domain';

import { BookPatcherRequest } from './BookPatcherRequest';

const logger = buildLogger('bookPatcher');

export class BookPatcher {
  private readonly repository: BookRepository;
  private readonly authorRepository: AuthorRepository;

  constructor(repository: BookRepository, authorRepository: AuthorRepository) {
    this.repository = repository;
    this.authorRepository = authorRepository;
  }

  async run(request: BookPatcherRequest, username: string): Promise<void> {
    const storedBook = await this.repository.search(request.id);

    if (storedBook === null) {
      throw new NotFoundError(`Book <${request.id}>`);
    }
    if (request.author) {
      const author = await this.authorRepository.search(request.author);
      if (!author) {
        throw new NotFoundError(`Author <${request.author}>`);
      }
    }

    const book = BookPatch.fromPrimitives(request);

    await this.repository.update(book);
    logger.info(`Updated Book: <${book.id}> by <${username}>`);
  }
}
