import { BookRepository } from '../domain/BookRepository';
import { BookRemoverRequest } from './BookRemoverRequest';

export class BookRemover {
  private readonly repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async run(request: BookRemoverRequest): Promise<void> {
    await this.repository.remove(request.id);
  }
}
