import { InvalidArgumentError } from './InvalidArgumentError';

export class DateValueObject {
  readonly value: Date;

  constructor(value: string) {
    this.ensureIsAValidDate(value);
    this.value = new Date(value);
  }

  private ensureIsAValidDate(value: string): void {
    const parsedDate = new Date(value);

    if (isNaN(parsedDate.getTime())) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${value}>`
      );
    }
  }
}
