import { StringValueObject } from '../../../shared/domain/valueObject';

export class SceneCircumstance extends StringValueObject {
  static readonly MIN_LENGTH = 0;
  static readonly MAX_LENGTH = 1024;
  readonly value: string;

  constructor(value: string) {
    super(value);
    this.value = this.ensureLength(
      value,
      SceneCircumstance.MIN_LENGTH,
      SceneCircumstance.MAX_LENGTH
    );
  }
}
