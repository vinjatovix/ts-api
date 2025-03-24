import { createError } from '../../../shared/domain/errors';
import { NumberValueObject } from '../../../shared/domain/valueObject';

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
      throw createError.invalidArgument(
        `<${this.constructor.name}> does not allow the value <${value}>`
      );
    }
  }

  private ensureLength(value: number): void {
    if (value <= 0) {
      throw createError.invalidArgument(
        `<${this.constructor.name}> <${value}> has is less than 1`
      );
    }
  }
}
