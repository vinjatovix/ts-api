import { BookReleaseDate } from '../../../../../../src/Contexts/apiApp/Books/domain';

import { random } from '../../../../fixtures/shared';

export class BookReleaseDateMother {
  static create(value: string) {
    return new BookReleaseDate(value);
  }
  static random() {
    return this.create(random.date().toString());
  }
  static invalidValue() {
    return 'invalid-date';
  }
}
