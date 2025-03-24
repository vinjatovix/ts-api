import { RelationshipCircumstance } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain';
import { random } from '../../../fixtures/shared';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { SceneCircumstanceMother } from '../../Scenes/domain/mothers';

describe('RelationshipCircumstance', () => {
  it('should create a valid relationship circumstance', () => {
    const valueObjects = {
      character: UuidMother.random(),
      circumstance: SceneCircumstanceMother.random()
    };

    expect(new RelationshipCircumstance(valueObjects)).toMatchObject(
      valueObjects
    );
  });

  it('should create a valid relationship from primitives', () => {
    const primitives = {
      character: random.uuid(),
      circumstance: SceneCircumstanceMother.random().value
    };

    expect(RelationshipCircumstance.fromPrimitives(primitives)).toBeInstanceOf(
      RelationshipCircumstance
    );
  });
});
