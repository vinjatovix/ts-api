import { v4 as uuidv4 } from 'uuid';
import validate from 'uuid-validate';
import { InvalidArgumentError } from '../errors/InvalidArgumentError';

export class Uuid {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsValidUuid(value);

    this.value = value;
  }
  static random(): string {
    return uuidv4();
  }

  public toString(): string {
    return this.value;
  }
  private ensureIsValidUuid(id: string): void {
    if (!validate(id)) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${id}>`
      );
    }
  }
}
