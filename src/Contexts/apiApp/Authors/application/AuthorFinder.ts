import { RequestById } from '../../../shared/application/interfaces';
import { createError } from '../../../shared/domain/errors';

import { AuthorRepository } from '../domain';

import { AuthorResponse } from './interfaces/AuthorResponse';

export class AuthorFinder {
  private readonly repository: AuthorRepository;

  constructor(repository: AuthorRepository) {
    this.repository = repository;
  }

  async run(request: RequestById): Promise<AuthorResponse> {
    const author = await this.repository.search(request.id);

    if (!author) {
      throw createError.notFound(`Author <${request.id}>`);
    }

    return {
      id: author.id.value,
      name: author.name.value,
      metadata: author.metadata.toPrimitives()
    };
  }
}
