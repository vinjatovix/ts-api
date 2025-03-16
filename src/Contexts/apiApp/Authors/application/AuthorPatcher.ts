import { createError } from '../../../shared/domain/errors';
import { buildLogger } from '../../../shared/plugins/logger.plugin';
import { Username } from '../../Auth/domain';
import { AuthorPatch } from '../domain';
import { AuthorRepository } from '../domain/interfaces';
import { AuthorPatcherRequest } from './interfaces';

const logger = buildLogger('authorPatcher');

export class AuthorPatcher {
  private readonly repository: AuthorRepository;

  constructor(repository: AuthorRepository) {
    this.repository = repository;
  }

  async run(request: AuthorPatcherRequest, username: string): Promise<void> {
    const storedAuthor = await this.repository.search(request.id);

    if (storedAuthor === null) {
      throw createError.notFound(`Author <${request.id}>`);
    }

    const author = AuthorPatch.fromPrimitives(request);

    await this.repository.update(author, new Username(username));
    logger.info(`Updated Author: <${author.id}> by <${username}>`);
  }
}
