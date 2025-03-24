import { createError } from '../errors';

export class StringValueObject {
  readonly value: string;

  constructor(value: string) {
    this.value = this.ensureType(value);
  }

  protected ensureType(value: string): string {
    if (typeof value !== 'string') {
      throw createError.invalidArgument(
        `<${this.constructor.name}> does not allow the value <${value}>`
      );
    }

    return value.trim();
  }

  protected ensureLength(
    value: string,
    minLength: number,
    maxLength: number
  ): string {
    const _value = value.trim();

    if (_value.length < minLength || _value.length > maxLength) {
      const message =
        _value.length < minLength
          ? `less than ${minLength}`
          : `more than ${maxLength}`;
      throw createError.invalidArgument(
        `<${this.constructor.name}> <${value}> has ${message} characters`
      );
    }

    return _value;
  }
}
