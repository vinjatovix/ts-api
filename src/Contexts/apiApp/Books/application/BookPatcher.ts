import { hasValuesChanges } from '../../../shared/application/utils';
import { createError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins';
import { Username } from '../../Auth/domain';
import { AuthorRepository } from '../../Authors/domain/interfaces';
import { BookPatch } from '../domain';
import { BookRepository } from '../domain/interfaces';
import { BookPatcherRequest } from './interfaces';

const logger = buildLogger('bookPatcher');

export class BookPatcher {
  private readonly repository: BookRepository;
  private readonly authorRepository: AuthorRepository;

  constructor(repository: BookRepository, authorRepository: AuthorRepository) {
    this.repository = repository;
    this.authorRepository = authorRepository;
  }

  async run(
    request: BookPatcherRequest,
    user: { username: string }
  ): Promise<void> {
    const storedBook = await this.repository.search(request.id);

    if (!storedBook) {
      throw createError.notFound(`Book <${request.id}>`);
    }

    if (request.author) {
      const author = await this.authorRepository.search(request.author);
      if (!author) {
        throw createError.notFound(`Author <${request.author}>`);
      }
    }

    if (
      !hasValuesChanges(
        request as unknown as Record<string, unknown>,
        storedBook
      )
    ) {
      throw createError.invalidArgument('Nothing to update');
    }

    const book = BookPatch.fromPrimitives(request);

    await this.repository.update(book, new Username(user.username));
    logger.info(`Updated Book: <${book.id}> by <${user.username}>`);
  }
}
