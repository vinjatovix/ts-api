import { BookId } from '../../../../../../src/Contexts/apiApp/Books/domain';

import { random } from '../../../../fixtures/shared';

export class BookIdMother {
  static create(value: string) {
    return new BookId(value);
  }
  static random() {
    return this.create(random.uuid());
  }

  static invalidValue() {
    return random.word({ min: 1, max: 40 });
  }
}
