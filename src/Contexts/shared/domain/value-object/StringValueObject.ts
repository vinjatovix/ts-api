import { InvalidArgumentError } from '../errors/InvalidArgumentError';

export class StringValueObject {
  readonly value: string;

  constructor(value: string) {
    this.value = this.ensureIsValidValue(value);
  }

  private ensureIsValidValue(value: string): string {
    if (typeof value !== 'string') {
      throw new InvalidArgumentError('Invalid value');
    }

    return value.trim();
  }
}
