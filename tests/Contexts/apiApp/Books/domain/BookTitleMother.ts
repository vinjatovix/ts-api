import { BookTitle } from '../../../../../src/Contexts/apiApp/Books/domain/BookTitle';
import { random } from '../../../fixtures/shared';

export class BookTitleMother {
  static create(value: string) {
    return new BookTitle(value);
  }

  static random(): BookTitle {
    return this.create(random.word({ min: 1, max: 100 }));
  }

  static invalidValue(): string {
    return random.word({ min: 101 });
  }
}
