import { BookPages } from '../../../../../../src/Contexts/apiApp/Books/domain';

import { random } from '../../../../fixtures/shared';

export class BookPagesMother {
  static create(value: number) {
    return new BookPages(value);
  }
  static random() {
    return this.create(random.integer({ min: 1, max: 9999 }));
  }

  static invalidType(): unknown {
    return random.arrayElement([
      random.word(),
      Infinity,
      random.boolean(),
      NaN
    ]);
  }

  static invalidValue(): number {
    return random.integer({ min: -9999, max: 0 });
  }
}
