import { StringValueObject } from '../../../shared/domain/valueObject';

export class CharacterName extends StringValueObject {
  static readonly MIN_LENGTH = 1;
  static readonly MAX_LENGTH = 42;
  readonly value: string;

  constructor(value: string) {
    super(value);
    this.value = this.ensureLength(
      value,
      CharacterName.MIN_LENGTH,
      CharacterName.MAX_LENGTH
    );
  }
}
