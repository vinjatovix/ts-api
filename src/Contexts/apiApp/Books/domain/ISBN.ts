import { createError } from '../../../shared/domain/errors';
import { StringValueObject } from '../../../shared/domain/valueObject/StringValueObject';

export class Isbn extends StringValueObject {
  readonly value: string;

  constructor(value: string) {
    super(value);
    this.value = this.ensureIsAValidISBN13(value);
  }

  private ensureIsAValidISBN13(value: string): string {
    const _value = value.trim();
    if (
      /^(978|979)-\d{1,5}-\d{1,7}-\d{1,7}-\d$/.test(_value) === false ||
      _value.replace(/-/g, '').length > 13
    ) {
      throw createError.invalidArgument(
        `<${this.constructor.name}> <${value}> is not a valid ISBN`
      );
    }

    return _value;
  }
}
