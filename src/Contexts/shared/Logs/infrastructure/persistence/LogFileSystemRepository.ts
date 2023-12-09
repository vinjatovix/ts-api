import { Log } from '../../domain/Log';
import { LogLevel } from '../../domain/LogLevel';
import { LogRepository } from '../../domain/LogRepository';
import { LogDataSource } from './LogDataSource';

export class LogFileSystemRepository implements LogRepository {
  constructor(private readonly logDataSource: LogDataSource) {}

  async save(log: Log): Promise<void> {
    this.logDataSource.persist(log);
  }

  async search(severityLevel: LogLevel): Promise<Log[]> {
    return this.logDataSource.getBySeverity(severityLevel);
  }
}
