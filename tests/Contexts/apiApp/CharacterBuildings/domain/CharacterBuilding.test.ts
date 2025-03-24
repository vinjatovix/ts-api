import {
  Center,
  CharacterBuilding,
  RelationshipCircumstance
} from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain/';
import { Metadata } from '../../../../../src/Contexts/shared/domain/valueObject';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../Auth/domain/mothers';
import { SceneCircumstanceMother } from '../../Scenes/domain/mothers';
import { random } from '../../../fixtures/shared';

const user = UserMother.random().username.value;
const metadata = new Metadata({
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: user,
  updatedBy: user
});

describe('CharacterBuilding', () => {
  it('should create a valid building', () => {
    const buildingValueObjects = {
      id: UuidMother.random(),
      actor: UuidMother.random(),
      character: UuidMother.random(),
      scene: UuidMother.random(),
      center: new Center(
        random.arrayElement(['mental', 'emotional', 'instinctive']) as string
      ),
      sceneCircumstances: SceneCircumstanceMother.random(),
      previousCircumstances: SceneCircumstanceMother.random(),
      relationshipCircumstances: [
        new RelationshipCircumstance({
          character: UuidMother.random(),
          circumstance: SceneCircumstanceMother.random()
        })
      ],
      metadata
    };

    expect(new CharacterBuilding(buildingValueObjects)).toMatchObject(
      buildingValueObjects
    );
  });

  it('should create a valid building from primitives', () => {
    const primitives = {
      id: random.uuid(),
      actor: random.uuid(),
      character: random.uuid(),
      scene: random.uuid(),
      center: random.arrayElement([
        'mental',
        'emotional',
        'instinctive'
      ]) as string,
      sceneCircumstances: SceneCircumstanceMother.random().value,
      previousCircumstances: SceneCircumstanceMother.random().value,
      relationshipCircumstances: [
        {
          character: random.uuid(),
          circumstance: SceneCircumstanceMother.random().value
        }
      ],
      metadata: metadata.toPrimitives()
    };

    expect(CharacterBuilding.fromPrimitives(primitives)).toBeInstanceOf(
      CharacterBuilding
    );
  });
});
