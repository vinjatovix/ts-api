export class StringValueObject {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  equals(valueObject: StringValueObject): boolean {
    return this.value === valueObject.value;
  }
}
