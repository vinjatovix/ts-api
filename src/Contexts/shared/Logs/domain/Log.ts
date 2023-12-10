import { LogLevel } from './LogLevel';
import { InvalidArgumentError } from '../../domain/errors/InvalidArgumentError';
import { AggregateRoot } from '../../domain/AggregateRoot';
import { Uuid } from '../../domain/value-object/Uuid';

export class Log extends AggregateRoot {
  readonly id: string;
  readonly level: string;
  readonly timestamp: Date;
  readonly message: string;

  constructor(level: string, message: string, timestamp?: Date, id?: string) {
    super();
    this.id = id || Uuid.random();
    this.level = level;
    this.message = message;
    this.timestamp = timestamp ?? new Date();
    this.validate();
  }

  static fromString = (json: string): Log => {
    const { level, message, timestamp, id } = JSON.parse(json);
    const log = Log.fromPrimitives({
      level,
      message,
      timestamp: new Date(timestamp),
      id
    });

    return log;
  };

  static fromPrimitives = ({
    id,
    level,
    message,
    timestamp
  }: {
    id?: string;
    level: string;
    message: string;
    timestamp: string | Date;
  }): Log => {
    return new Log(level, message, new Date(timestamp), id);
  };

  public toPrimitives(): Record<string, unknown> {
    return {
      id: this.id,
      level: this.level,
      message: this.message,
      timestamp: this.timestamp
    };
  }

  public toString = (): string => {
    return JSON.stringify({
      level: this.level,
      message: this.message,
      timestamp: this.timestamp,
      id: this.id
    });
  };

  private ensureIsValidLevel = (level: string): void => {
    if (!Object.values(LogLevel).includes(level as LogLevel)) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${level}>`
      );
    }
  };

  private ensureIsValidMessage = (message: string): void => {
    if (!message) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> needs a message`
      );
    }
  };

  private validate = (): void => {
    this.ensureIsValidLevel(this.level);
    this.ensureIsValidMessage(this.message);
  };
}
