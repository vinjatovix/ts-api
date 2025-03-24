import { SceneCircumstance } from '../../../../../../src/Contexts/apiApp/Scenes/domain';
import { random } from '../../../../fixtures/shared';

export class SceneCircumstanceMother {
  static create(string: string) {
    return new SceneCircumstance(string);
  }
  static random() {
    return new SceneCircumstance(
      random.word({
        min: SceneCircumstance.MIN_LENGTH,
        max: SceneCircumstance.MAX_LENGTH
      })
    );
  }
}
