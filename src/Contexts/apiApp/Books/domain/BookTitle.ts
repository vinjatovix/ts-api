import { InvalidArgumentError } from '../../../shared/domain/errors/InvalidArgumentError';
import { StringValueObject } from '../../../shared/domain/value-object/StringValueObject';

export class BookTitle extends StringValueObject {
  readonly value: string;

  constructor(value: string) {
    super(value);
    this.ensureType(value);
    this.ensureLength(value);

    this.value = value.trim();
  }

  private ensureLength(value: string): void {
    const _value = value.trim();
    if (!_value.length) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> <${value}> has less than 1 characters`
      );
    }
    if (_value.length > 100) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> <${value}> has more than 100 characters`
      );
    }
  }
}
