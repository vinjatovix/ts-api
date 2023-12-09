import { Log } from './Log';
import { LogLevel } from './LogLevel';

export interface LogRepository {
  save(log: Log): Promise<void>;
  search(severityLevel: LogLevel): Promise<Log[]>;
}
