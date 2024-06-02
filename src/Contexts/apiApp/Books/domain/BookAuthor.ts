import { InvalidArgumentError } from '../../../shared/domain/errors/InvalidArgumentError';
import { StringValueObject } from '../../../shared/domain/value-object/StringValueObject';

export class BookAuthor extends StringValueObject {
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
        `<${this.constructor.name}> does not allow empty values`
      );
    }
    if (_value.length > 40) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> <${value}> has more than 40 characters`
      );
    }
  }
}
