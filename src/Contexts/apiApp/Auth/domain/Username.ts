import { InvalidArgumentError } from '../../../shared/domain/errors/InvalidArgumentError';
import { StringValueObject } from '../../../shared/domain/value-object/StringValueObject';

export class Username extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureLength(value);
  }

  private ensureLength(value: string): string {
    if (value.length < 4) {
      throw new InvalidArgumentError(
        '<Username> must be at least 4 characters long'
      );
    }

    if (value.length > 20) {
      throw new InvalidArgumentError(
        '<Username> must be less than 20 characters long'
      );
    }

    return value;
  }
}
