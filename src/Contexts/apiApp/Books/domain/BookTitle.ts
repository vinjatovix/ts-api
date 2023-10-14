import { InvalidArgumentError } from '../../../shared/domain/value-object/InvalidArgumentError';
import { StringValueObject } from '../../../shared/domain/value-object/StringValueObject';

export class BookTitle extends StringValueObject {
  readonly value: string;

  constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan100Characters(value);

    this.value = value;
  }

  private ensureLengthIsLessThan100Characters(value: string): void {
    if (value.length > 100) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> <${value}> has more than 100 characters`
      );
    }
  }
}
