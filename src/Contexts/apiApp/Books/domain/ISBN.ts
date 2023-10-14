import { InvalidArgumentError } from '../../../shared/domain/value-object/InvalidArgumentError';
import { StringValueObject } from '../../../shared/domain/value-object/StringValueObject';

export class ISBN extends StringValueObject {
  readonly value: string;

  constructor(value: string) {
    super(value);
    this.ensureLengthIsAValidISBN13(value);

    this.value = value;
  }

  private ensureLengthIsAValidISBN13(value: string): void {
    if (/^(978|979)-\d{1,5}-\d{1,7}-\d{1,7}-\d$/.test(value) === false) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> <${value}> is not a valid ISBN`
      );
    }

    if (value.replace(/-/g, '').length > 13) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> <${value}> has more than 13 characters`
      );
    }
  }
}
