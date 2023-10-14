import { ISBN } from '../../../../../src/Contexts/apiApp/Books/domain/ISBN';
import { random } from '../../../fixtures/shared';

export class ISBNMother {
  static create(value: string) {
    return new ISBN(value);
  }
  static random() {
    return this.create(random.isbn());
  }

  static invalidValue() {
    return random.word();
  }
}
