import { InvalidArgumentError } from '../../../shared/domain/value-object/InvalidArgumentError';
import { StringValueObject } from '../../../shared/domain/value-object/StringValueObject';

export class BookAuthor extends StringValueObject {
  readonly value: string;

  constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan40characters(value);

    this.value = value;
  }

  private ensureLengthIsLessThan40characters(value: string): void {
    if (value.length > 40) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> <${value}> has more than 40 characters`
      );
    }
  }
}
