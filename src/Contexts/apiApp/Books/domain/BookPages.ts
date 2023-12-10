import { InvalidArgumentError } from '../../../shared/domain/errors/InvalidArgumentError';
import { NumberValueObject } from '../../../shared/domain/value-object/NumberValueObject';

export class BookPages extends NumberValueObject {
  readonly value: number;

  constructor(value: number) {
    super(value);
    this.ensureType(value);
    this.ensureLength(value);

    this.value = value;
  }

  private ensureType(value: number): void {
    if (
      typeof value !== 'number' ||
      isNaN(value) ||
      !isFinite(value) ||
      typeof value === 'boolean'
    ) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${value}>`
      );
    }
  }

  private ensureLength(value: number): void {
    if (value <= 0) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> <${value}> has is less than 1`
      );
    }
  }
}
