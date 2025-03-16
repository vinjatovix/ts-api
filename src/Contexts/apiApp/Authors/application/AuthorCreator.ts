import { createError } from '../../../shared/domain/errors';
import { Uuid } from '../../../shared/domain/valueObject';
import { Metadata } from '../../../shared/domain/valueObject/Metadata';
import { buildLogger } from '../../../shared/plugins';
import { Author, AuthorName } from '../domain';
import { AuthorRepository } from '../domain/interfaces';
import { AuthorCreatorRequest } from './interfaces';

const logger = buildLogger('authorCreator');

export class AuthorCreator {
  private readonly repository: AuthorRepository;

  constructor(repository: AuthorRepository) {
    this.repository = repository;
  }

  async run(request: AuthorCreatorRequest, username: string): Promise<void> {
    await this.validateDependencies(request);

    const author = new Author({
      id: new Uuid(request.id),
      name: new AuthorName(request.name),
      metadata: new Metadata({
        createdAt: new Date(),
        createdBy: username,
        updatedAt: new Date(),
        updatedBy: username
      })
    });

    await this.repository.save(author);
    logger.info(`Created Author: <${author.id.value}> by <${username}>`);
  }

  private async validateDependencies(
    request: AuthorCreatorRequest
  ): Promise<void> {
    const storedAuthor = await this.repository.search(request.id);
    if (storedAuthor) {
      throw createError.conflict(`Author <${request.id}> already exists`);
    }
  }
}
