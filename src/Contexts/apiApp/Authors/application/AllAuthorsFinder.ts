import { AuthorPrimitives, AuthorRepository } from '../domain/interfaces';

export class AllAuthorsFinder {
  private readonly repository: AuthorRepository;

  constructor(repository: AuthorRepository) {
    this.repository = repository;
  }

  async run(): Promise<AuthorPrimitives[]> {
    const authors = await this.repository.findAll();

    return authors.map((author) => author.toPrimitives());
  }
}
