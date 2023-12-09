import { LogLevel } from './LogLevel';
import { InvalidArgumentError } from '../../domain/errors/InvalidArgumentError';
import { AggregateRoot } from '../../domain/AggregateRoot';
import { Uuid } from '../../domain/value-object/Uuid';

export class Log extends AggregateRoot {
  readonly id: string;
  readonly level: string;
  readonly createdAt: Date;
  readonly message: string;

  constructor(level: string, message: string, createdAt?: Date, id?: string) {
    super();
    this.id = id || Uuid.random();
    this.level = level;
    this.message = message;
    this.createdAt = createdAt ?? new Date();
    this.validate();
  }

  static fromString = (json: string): Log => {
    const { level, message, createdAt, id } = JSON.parse(json);
    const log = Log.fromPrimitives({
      level,
      message,
      createdAt: new Date(createdAt),
      id
    });

    return log;
  };

  static fromPrimitives = ({
    id,
    level,
    message,
    createdAt
  }: {
    id?: string;
    level: string;
    message: string;
    createdAt: string | Date;
  }): Log => {
    return new Log(level, message, new Date(createdAt), id);
  };

  public toPrimitives(): Record<string, unknown> {
    return {
      id: this.id,
      level: this.level,
      message: this.message,
      createdAt: this.createdAt
    };
  }

  public toString = (): string => {
    return JSON.stringify({
      level: this.level,
      message: this.message,
      createdAt: this.createdAt,
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
