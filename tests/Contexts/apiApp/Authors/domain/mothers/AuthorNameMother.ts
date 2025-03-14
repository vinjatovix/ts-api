import { AuthorName } from '../../../../../../src/Contexts/apiApp/Authors/domain';
import { random } from '../../../../fixtures/shared';

export class AuthorNameMother {
  static create(value: string) {
    return new AuthorName(value);
  }
  static random() {
    return this.create(random.word({ min: 1, max: 20 }));
  }

  static invalidValue(mode?: string) {
    switch (mode) {
      case 'max-length':
        return this.exceedMaxLength();
      case 'min-length':
        return this.exceedMinLength();
      case 'invalid-type':
        return this.invalidType();
      default:
        return random.arrayElement([
          random.word({ min: AuthorName.MAX_LENGTH + 1, max: 255 }),
          random.integer(),
          random.boolean()
        ]);
    }
  }

  static exceedMaxLength() {
    return random.word({ min: AuthorName.MAX_LENGTH + 1, max: 255 });
  }

  static exceedMinLength() {
    return '';
  }

  static invalidType() {
    return random.arrayElement([random.integer(), random.boolean()]);
  }
}
