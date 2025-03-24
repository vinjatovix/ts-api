import { RequestById } from '../../../shared/application/RequestById';
import { NotFoundError } from '../../../shared/domain/errors/NotFoundError';

import { AuthorRepository } from '../domain';

import { AuthorResponse } from './AuthorResponse';

export class AuthorFinder {
  private readonly repository: AuthorRepository;

  constructor(repository: AuthorRepository) {
    this.repository = repository;
  }

  async run(request: RequestById): Promise<AuthorResponse> {
    const author = await this.repository.search(request.id);

    if (!author) {
      throw new NotFoundError(`Author <${request.id}>`);
    }

    return {
      id: author.id.value,
      name: author.name.value
    };
  }
}
