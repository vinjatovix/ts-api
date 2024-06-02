import { NotFoundError } from '../../../shared/domain/errors/NotFoundError';
import { buildLogger } from '../../../shared/plugins/logger.plugin';

import { AuthorPatch, AuthorRepository } from '../domain';

import { AuthorPatcherRequest } from './AuthorPatcherRequest';

const logger = buildLogger('authorPatcher');

export class AuthorPatcher {
  private readonly repository: AuthorRepository;

  constructor(repository: AuthorRepository) {
    this.repository = repository;
  }

  async run(request: AuthorPatcherRequest, username: string): Promise<void> {
    const storedAuthor = await this.repository.search(request.id);

    if (storedAuthor === null) {
      throw new NotFoundError(`Author <${request.id}>`);
    }

    const author = AuthorPatch.fromPrimitives(request);

    await this.repository.update(author);
    logger.info(`Updated Author: <${author.id}> by <${username}>`);
  }
}
