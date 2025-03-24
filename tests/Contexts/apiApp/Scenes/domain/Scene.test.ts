import {
  Scene,
  SceneCircumstance,
  SceneProps
} from '../../../../../src/Contexts/apiApp/Scenes/domain';
import { Metadata } from '../../../../../src/Contexts/shared/domain/valueObject';
import { random } from '../../../fixtures/shared';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../Auth/domain/mothers';

const user = UserMother.random().username.value;

describe('Scene', () => {
  it('should create a valid scene', () => {
    const sceneValueObjects: SceneProps = {
      id: UuidMother.random(),
      description: new SceneCircumstance(
        random.word({
          min: SceneCircumstance.MIN_LENGTH,
          max: SceneCircumstance.MAX_LENGTH
        })
      ),
      characters: [UuidMother.random(), UuidMother.random()],
      metadata: new Metadata({
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user,
        updatedBy: user
      })
    };

    expect(new Scene(sceneValueObjects)).toMatchObject(sceneValueObjects);
  });
});
