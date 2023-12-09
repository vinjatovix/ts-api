import { Log } from '../../../../src/Contexts/shared/Logs/domain/Log';
import { LogLevel } from '../../../../src/Contexts/shared/Logs/domain/LogLevel';
import { LogRepository } from '../../../../src/Contexts/shared/Logs/domain/LogRepository';
import { LogMother } from '../domain/LogMother';

export class LogRepositoryMock implements LogRepository {
  private persistMock = jest.fn();
  private getBySeverityMock = jest.fn();

  constructor() {
    this.persistMock = jest.fn();
    this.getBySeverityMock = jest.fn();
  }
  async save(log: Log): Promise<void> {
    this.persistMock(log);
  }
  assertPersistHasBeenCalledWith(expected: Log): void {
    expect(this.persistMock).toHaveBeenCalledWith(expected);
  }

  async search(severityLevel: LogLevel): Promise<Log[]> {
    const logs = LogMother.create(severityLevel);
    this.getBySeverityMock = jest.fn().mockResolvedValue(logs);

    return this.getBySeverityMock(severityLevel);
  }

  assertGetBySeverityHasBeenCalledWith(expected: LogLevel): void {
    expect(this.getBySeverityMock).toHaveBeenCalledWith(expected);
  }
}
