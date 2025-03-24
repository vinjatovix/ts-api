import { InvalidArgumentError } from '../../../shared/domain/errors/InvalidArgumentError';
import { StringValueObject } from '../../../shared/domain/value-object/StringValueObject';

export class AuthorName extends StringValueObject {
  readonly value: string;

  constructor(value: string) {
    super(value);
    this.value = this.ensureLength(this.ensureType(value));
  }

  private ensureLength(value: string): string {
    const _value = value.trim();

    if (_value.length < 1 || _value.length > 20) {
      const message = _value.length < 1 ? 'less than 1' : 'more than 20';
      throw new InvalidArgumentError(
        `<${this.constructor.name}> <${value}> has ${message} characters`
      );
    }

    return _value;
  }
}
