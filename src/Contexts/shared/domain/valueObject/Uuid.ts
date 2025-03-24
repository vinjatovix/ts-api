import validate from 'uuid-validate';
import { v4 as uuidv4 } from 'uuid';
import { createError } from '../errors';

export class Uuid {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsValidUuid(value);
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  static random(): Uuid {
    return new Uuid(uuidv4());
  }

  private ensureIsValidUuid(id: string): void {
    if (!validate(id)) {
      throw createError.invalidArgument(
        `<${this.constructor.name}> does not allow the value <${id}>`
      );
    }
  }
}
