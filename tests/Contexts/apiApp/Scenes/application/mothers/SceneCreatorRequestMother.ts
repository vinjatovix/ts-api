import { SceneCreatorRequest } from '../../../../../../src/Contexts/apiApp/Scenes/application/interfaces';
import { SceneCircumstance } from '../../../../../../src/Contexts/apiApp/Scenes/domain';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/valueObject';
import { random } from '../../../../fixtures/shared';
import { UuidMother } from '../../../../fixtures/shared/domain/mothers';

export class SceneCreatorRequestMother {
  static create({
    id,
    description,
    characters
  }: {
    id: Uuid;
    description: SceneCircumstance;
    characters: Uuid[];
  }): SceneCreatorRequest {
    return {
      id: id.value,
      description: description.value,
      characters: characters.map((c) => c.value)
    };
  }

  static random(id?: string): SceneCreatorRequest {
    return this.create({
      id: id ? UuidMother.create(id) : UuidMother.random(),
      description: new SceneCircumstance(
        random.word({
          min: SceneCircumstance.MIN_LENGTH,
          max: SceneCircumstance.MAX_LENGTH
        })
      ),
      characters: [(UuidMother.random(), UuidMother.random())]
    });
  }
}
