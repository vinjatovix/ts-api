import { StringValueObject } from '../../../shared/domain/valueObject/StringValueObject';

export class BookTitle extends StringValueObject {
  static readonly MIN_LENGTH = 1;
  static readonly MAX_LENGTH = 100;
  readonly value: string;

  constructor(value: string) {
    super(value);
    this.value = this.ensureLength(
      value,
      BookTitle.MIN_LENGTH,
      BookTitle.MAX_LENGTH
    );
  }
}
