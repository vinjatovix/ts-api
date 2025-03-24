import { ScenePatch } from '../../../../../src/Contexts/apiApp/Scenes/domain/ScenePatch';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { SceneCircumstanceMother } from './mothers';

const BASE_SCENE = {
  id: UuidMother.random().value,
  description: SceneCircumstanceMother.random().value,
  characters: [UuidMother.random().value]
};

describe('ScenePatch', () => {
  it('should create a valid scene', () => {
    const patch = ScenePatch.fromPrimitives(BASE_SCENE);

    expect(patch).toBeInstanceOf(ScenePatch);
  });

  it('should fail if there is nothing to patch', () => {
    expect(() => {
      ScenePatch.fromPrimitives({
        id: BASE_SCENE.id
      });
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));
  });
});
