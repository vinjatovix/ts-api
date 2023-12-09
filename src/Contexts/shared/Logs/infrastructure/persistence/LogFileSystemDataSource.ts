import fs from 'fs';

import { LogLevel } from '../../domain/LogLevel';
import { Log } from '../../domain/Log';
import { LogDataSource } from './LogDataSource';

export class LogFileSystemDataSource implements LogDataSource {
  private readonly logPath: string = 'logs/';

  private readonly logPaths: Record<string, string> = {
    [LogLevel.DEBUG]: 'logs/debug-logs.log',
    [LogLevel.INFO]: 'logs/info-logs.log',
    [LogLevel.WARN]: 'logs/warning-logs.log',
    [LogLevel.ERROR]: 'logs/error-logs.log'
  };

  constructor() {
    this.createLogsFiles();
  }

  private createLogsFiles = (): void => {
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath);
    }
    Object.values(this.logPaths).forEach((path) => {
      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '');
      }
    });
  };

  async persist(newLog: Log): Promise<void> {
    const logAsString = `${newLog.toString()}\n`;

    if (newLog.level === LogLevel.DEBUG) {
      fs.appendFileSync(this.logPaths[LogLevel.DEBUG], logAsString);
      return;
    }

    fs.appendFileSync(this.logPaths[LogLevel.INFO], logAsString);
    if (newLog.level === LogLevel.INFO) {
      return;
    }

    fs.appendFileSync(this.logPaths[newLog.level], logAsString);
  }

  private getLogsFromFile = (path: string): Log[] => {
    const content = fs.readFileSync(path, 'utf8');
    const stringLogsArray = content.split('\n');
    const logs = stringLogsArray.map(Log.fromString);

    return logs;
  };

  async getBySeverity(severityLevel: LogLevel = LogLevel.INFO): Promise<Log[]> {
    if (!(severityLevel in this.logPaths)) {
      throw new Error('Invalid severity level');
    }

    const logPath = this.logPaths[severityLevel];
    return this.getLogsFromFile(logPath);
  }
}
