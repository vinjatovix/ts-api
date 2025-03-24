import { Isbn } from '../../../../../../src/Contexts/apiApp/Books/domain';
import { random } from '../../../../fixtures/shared';

export class ISBNMother {
  static create(value: string) {
    return new Isbn(value);
  }
  static random() {
    return this.create(random.isbn());
  }

  static invalidValue() {
    return random.word();
  }
}
