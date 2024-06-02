import { BookAuthor } from '../../../../../../src/Contexts/apiApp/Books/domain';

import { random } from '../../../../fixtures/shared';

export class BookAuthorMother {
  static create(value: string) {
    return new BookAuthor(value);
  }
  static random() {
    return this.create(random.uuid());
  }

  static invalidValue() {
    return random.word({ min: 41, max: 255 });
  }
}
