import { BookAuthor } from '../../../../../src/Contexts/apiApp/Books/domain/BookAuthor';
import { random } from '../../../fixtures/shared';

export class BookAuthorMother {
  static create(value: string) {
    return new BookAuthor(value);
  }
  static random() {
    return this.create(random.word({ min: 1, max: 40 }));
  }

  static invalidValue() {
    return random.word({ min: 41 });
  }
}
