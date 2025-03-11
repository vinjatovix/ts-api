import { CharacterName } from '../../../../../../src/Contexts/apiApp/Characters/domain';
import { random } from '../../../../fixtures/shared';

export class CharacterNameMother {
  static create(value: string) {
    return new CharacterName(value);
  }

  static random(): CharacterName {
    return CharacterNameMother.create(
      random.word({
        min: CharacterName.MIN_LENGTH,
        max: CharacterName.MAX_LENGTH
      })
    );
  }
}
