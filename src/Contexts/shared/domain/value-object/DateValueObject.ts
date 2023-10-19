import { InvalidArgumentError } from './InvalidArgumentError';

export class DateValueObject {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsAValidDate(value);
    this.value = value;
  }

  private ensureIsAValidDate(value: string): void {
    const parsedDate = new Date(value);

    // Verifica si la cadena representa una fecha válida
    if (isNaN(parsedDate.getTime())) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${value}>`
      );
    }
  }
}
