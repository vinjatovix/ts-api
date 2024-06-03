import { AuthorRepository } from '../domain/';
import { AuthorResponse } from './interfaces/AuthorResponse';

export class AllAuthorsFinder {
  private readonly repository: AuthorRepository;

  constructor(repository: AuthorRepository) {
    this.repository = repository;
  }

  async run(): Promise<AuthorResponse[]> {
    const authors = await this.repository.findAll();

    return authors.map((author) => ({
      id: author.id.value,
      name: author.name.value
    }));
  }
}
