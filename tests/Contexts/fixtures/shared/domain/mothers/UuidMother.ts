import { Uuid } from '../../../../../../src/Contexts/shared/domain/valueObject';
import { random } from '../../../../fixtures/shared';

export class UuidMother {
  static create(value: string): Uuid {
    return new Uuid(value);
  }

  static random(): Uuid {
    return this.create(random.uuid());
  }

  static invalidValue(): string {
    return random.word({ min: 1, max: 40 });
  }
}
