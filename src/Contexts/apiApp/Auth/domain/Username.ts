import { StringValueObject } from '../../../shared/domain/valueObject';

export class Username extends StringValueObject {
  static readonly MIN_LENGTH = 4;
  static readonly MAX_LENGTH = 20;
  readonly value: string;

  constructor(value: string) {
    super(value);
    this.value = this.ensureLength(
      value,
      Username.MIN_LENGTH,
      Username.MAX_LENGTH
    );
  }
}
