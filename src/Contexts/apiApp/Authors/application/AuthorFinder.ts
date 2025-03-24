import { RequestById } from '../../../shared/application/interfaces';
import { createError } from '../../../shared/domain/errors';
import { AuthorPrimitives, AuthorRepository } from '../domain/interfaces';

export class AuthorFinder {
  private readonly repository: AuthorRepository;

  constructor(repository: AuthorRepository) {
    this.repository = repository;
  }

  async run({ id }: RequestById): Promise<AuthorPrimitives> {
    const author = await this.repository.search(id);

    if (!author) {
      throw createError.notFound(`Author <${id}>`);
    }

    return author.toPrimitives();
  }
}
