import { Log } from '../../../../src/Contexts/shared/Logs/domain/Log';
import { LogLevel } from '../../../../src/Contexts/shared/Logs/domain/LogLevel';
import { random } from '../../fixtures/shared';

export class LogMother {
  static create(level: LogLevel): Log {
    const message = random.description();

    return new Log(level, message);
  }
}
