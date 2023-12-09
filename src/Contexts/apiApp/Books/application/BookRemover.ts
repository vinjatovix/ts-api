import { Log } from '../../../shared/Logs/domain/Log';
import { LogLevel } from '../../../shared/Logs/domain/LogLevel';
import { LogRepository } from '../../../shared/Logs/domain/LogRepository';
import { BookRepository } from '../domain/BookRepository';
import { BookRemoverRequest } from './BookRemoverRequest';

export class BookRemover {
  private readonly repository: BookRepository;
  private readonly logRepository: LogRepository;

  constructor(repository: BookRepository, logRepository: LogRepository) {
    this.repository = repository;
    this.logRepository = logRepository;
  }

  async run(request: BookRemoverRequest): Promise<void> {
    await this.repository.remove(request.id);
    await this.logRepository.save(
      new Log(LogLevel.INFO, `Removed Book: <${request.id}>`)
    );
  }
}
