import { InvalidArgumentError } from '../errors/InvalidArgumentError';

export class StringValueObject {
  readonly value: string;

  constructor(value: string) {
    this.value = this.ensureType(value);
  }

  protected ensureType(value: string): string {
    if (typeof value !== 'string') {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${value}>`
      );
    }

    return value.trim();
  }
}
