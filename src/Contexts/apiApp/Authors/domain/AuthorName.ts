import { StringValueObject } from '../../../shared/domain/valueObject';

export class AuthorName extends StringValueObject {
  static readonly MIN_LENGTH = 1;
  static readonly MAX_LENGTH = 20;
  readonly value: string;

  constructor(value: string) {
    super(value);
    this.value = this.ensureLength(
      value,
      AuthorName.MIN_LENGTH,
      AuthorName.MAX_LENGTH
    );
  }
}
