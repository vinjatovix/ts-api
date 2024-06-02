import { ConflictError } from '../../../shared/domain/errors/ConflictError';
import { Uuid } from '../../../shared/domain/value-object/Uuid';
import { buildLogger } from '../../../shared/plugins/logger.plugin';

import { Author, AuthorName, AuthorRepository } from '../domain';

import { AuthorCreatorRequest } from './AuthorCreatorRequest';

const logger = buildLogger('authorCreator');

export class AuthorCreator {
  private readonly repository: AuthorRepository;

  constructor(repository: AuthorRepository) {
    this.repository = repository;
  }

  async run(request: AuthorCreatorRequest): Promise<void> {
    await this.validateDependencies(request);

    const author = new Author({
      id: new Uuid(request.id),
      name: new AuthorName(request.name)
    });

    await this.repository.save(author);
    logger.info(`Created Author: <${author.id.value}>`);
  }

  private async validateDependencies(
    request: AuthorCreatorRequest
  ): Promise<void> {
    const storedAuthor = await this.repository.search(request.id);

    if (storedAuthor) {
      throw new ConflictError(`Author <${request.id}> already exists`);
    }
  }
}
