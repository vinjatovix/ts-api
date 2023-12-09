import { Log } from '../../domain/Log';
import { LogLevel } from '../../domain/LogLevel';

export abstract class LogDataSource {
  abstract persist(log: Log): Promise<void>;
  abstract getBySeverity(severityLevel: LogLevel): Promise<Log[]>;
}
