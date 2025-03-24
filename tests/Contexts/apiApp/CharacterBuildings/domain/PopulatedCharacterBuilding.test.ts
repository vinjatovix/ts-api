import { User } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { Center } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain';
import { CharacterBuildingBaseProps } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain/CharacterBuildingBase';
import {
  PopulatedCharacterBuilding,
  PopulatedCharacterBuildingProps
} from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain/PopulatedCharacterBuilding';
import { Character } from '../../../../../src/Contexts/apiApp/Characters/domain';
import { Metadata } from '../../../../../src/Contexts/shared/domain/valueObject';
import { random } from '../../../fixtures/shared';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../Auth/domain/mothers';
import { CharacterMother } from '../../Characters/domain/mothers';
import {
  SceneCircumstanceMother,
  SceneMother
} from '../../Scenes/domain/mothers';

const createMetadata = (createdBy: string, updatedBy: string) =>
  new Metadata({
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy,
    updatedBy
  });

const username = UserMother.random().username.value;
const BASE_PROPS: CharacterBuildingBaseProps = {
  id: UuidMother.random(),
  center: new Center(
    random.arrayElement(['mental', 'emotional', 'instinctive']) as string
  ),
  sceneCircumstances: SceneCircumstanceMother.random(),
  previousCircumstances: SceneCircumstanceMother.random(),
  metadata: createMetadata(username, username)
};

const character = CharacterMother.random();
const character2 = CharacterMother.random();
const scene = SceneMother.random({ characters: [character.id] });
const actor = {
  id: UuidMother.random(),
  username: UserMother.random().username
};

describe('PopulatedCharacterBuilding', () => {
  const createPopulatedCharacterBuilding = (
    props: Partial<PopulatedCharacterBuildingProps>
  ) =>
    new PopulatedCharacterBuilding({
      ...BASE_PROPS,
      ...props
    });

  it('should create a valid populated CharacterBuilding', () => {
    const populatedCharacterBuildingValueObjects = {
      ...BASE_PROPS,
      actor: actor as Partial<User>,
      character,
      scene,
      relationshipCircumstances: [
        {
          character: character2,
          circumstance: SceneCircumstanceMother.random()
        }
      ],
      metadata: createMetadata(actor.username?.value, actor.username?.value)
    };

    expect(
      new PopulatedCharacterBuilding(populatedCharacterBuildingValueObjects)
    ).toMatchObject(populatedCharacterBuildingValueObjects);
  });

  describe('toPrimitives', () => {
    it('should return primitives from populated character building', () => {
      const populatedCharacterBuilding = createPopulatedCharacterBuilding({
        actor: actor as Partial<User>,
        character,
        scene,
        relationshipCircumstances: [
          {
            character: character2,
            circumstance: SceneCircumstanceMother.random()
          }
        ],
        metadata: createMetadata(actor.username?.value, actor.username?.value)
      });

      const primitives = populatedCharacterBuilding.toPrimitives();

      expect(primitives).toMatchObject({
        id: populatedCharacterBuilding.id.value,
        center: populatedCharacterBuilding?.center?.value,
        sceneCircumstances:
          populatedCharacterBuilding.sceneCircumstances?.value,
        previousCircumstances:
          populatedCharacterBuilding.previousCircumstances?.value,
        actor: {
          id: actor.id.value,
          username: actor.username?.value
        },
        character: character.toPrimitives(),
        scene: scene.toPrimitives(),
        relationshipCircumstances:
          populatedCharacterBuilding.relationshipCircumstances?.map((rc) => ({
            character: (rc.character as Character).toPrimitives(),
            circumstance: rc.circumstance.value
          })),
        metadata: populatedCharacterBuilding.metadata.toPrimitives()
      });
    });

    it('should populate only actor', () => {
      const valueObjects: PopulatedCharacterBuildingProps = {
        id: UuidMother.random(),
        actor: actor as Partial<User>,
        metadata: createMetadata(actor.username?.value, actor.username?.value)
      };

      const primitives = new PopulatedCharacterBuilding(
        valueObjects
      ).toPrimitives();

      expect(primitives).toMatchObject({
        id: valueObjects.id.value,
        actor: {
          id: actor.id.value,
          username: actor.username?.value
        },
        metadata: valueObjects.metadata.toPrimitives()
      });
      expect(primitives.character).toBeNull();
      expect(primitives.scene).toBeNull();
      expect(primitives.relationshipCircumstances).toBeNull();
    });

    it('should populate only character', () => {
      const valueObjects: PopulatedCharacterBuildingProps = {
        id: UuidMother.random(),
        character,
        metadata: createMetadata(username, username)
      };

      const populatedCharacterBuilding = new PopulatedCharacterBuilding(
        valueObjects
      );

      const primitives = populatedCharacterBuilding.toPrimitives();

      expect(primitives).toMatchObject({
        id: valueObjects.id.value,
        character: character.toPrimitives(),
        metadata: valueObjects.metadata.toPrimitives()
      });
      expect(primitives.actor).toBeNull();
      expect(primitives.scene).toBeNull();
      expect(primitives.relationshipCircumstances).toBeNull();
    });

    it('should populate only scene', () => {
      const valueObjects: PopulatedCharacterBuildingProps = {
        id: UuidMother.random(),
        scene,
        metadata: createMetadata(username, username)
      };

      const populatedCharacterBuilding = new PopulatedCharacterBuilding(
        valueObjects
      );

      const primitives = populatedCharacterBuilding.toPrimitives();

      expect(primitives).toMatchObject({
        id: valueObjects.id.value,
        scene: scene.toPrimitives(),
        metadata: valueObjects.metadata.toPrimitives()
      });
      expect(primitives.actor).toBeNull();
      expect(primitives.character).toBeNull();
      expect(primitives.relationshipCircumstances).toBeNull();
    });

    it('should populate only relationshipCircumstances', () => {
      const relationshipCircumstances = [
        {
          character: character2,
          circumstance: SceneCircumstanceMother.random()
        }
      ];

      const valueObjects: PopulatedCharacterBuildingProps = {
        id: UuidMother.random(),
        relationshipCircumstances,
        metadata: createMetadata(username, username)
      };

      const populatedCharacterBuilding = new PopulatedCharacterBuilding(
        valueObjects
      );

      const primitives = populatedCharacterBuilding.toPrimitives();

      expect(primitives).toMatchObject({
        id: valueObjects.id.value,
        relationshipCircumstances: relationshipCircumstances.map((rc) => ({
          character: rc.character.toPrimitives(),
          circumstance: rc.circumstance.value
        })),
        metadata: valueObjects.metadata.toPrimitives()
      });
      expect(primitives.actor).toBeNull();
      expect(primitives.character).toBeNull();
      expect(primitives.scene).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a full populated character building from primitives', () => {
      const primitives = {
        id: UuidMother.random().value,
        center: random.arrayElement([
          'mental',
          'emotional',
          'instinctive'
        ]) as string,
        sceneCircumstances: SceneCircumstanceMother.random().value,
        previousCircumstances: SceneCircumstanceMother.random().value,
        actor: {
          id: UuidMother.random().value,
          username: UserMother.random().username.value
        } as unknown as Partial<User>,
        character: CharacterMother.random().toPrimitives(),
        scene: SceneMother.random().toPrimitives(),
        relationshipCircumstances: [
          {
            character: CharacterMother.random().toPrimitives(),
            circumstance: SceneCircumstanceMother.random().value
          }
        ],
        metadata: createMetadata(username, username).toPrimitives()
      };

      const populatedCharacterBuilding =
        PopulatedCharacterBuilding.fromPrimitives(primitives);

      expect(populatedCharacterBuilding.toPrimitives()).toMatchObject(
        primitives
      );
    });

    it('should create a populated character building with only actor from primitives', () => {
      const primitives = {
        id: UuidMother.random().value,
        actor: {
          id: UuidMother.random().value,
          username: UserMother.random().username.value
        } as unknown as Partial<User>,
        metadata: createMetadata(username, username).toPrimitives()
      };

      const populatedCharacterBuilding =
        PopulatedCharacterBuilding.fromPrimitives(primitives);

      expect(populatedCharacterBuilding.toPrimitives()).toMatchObject({
        ...primitives,
        character: null,
        scene: null,
        relationshipCircumstances: null
      });
    });

    it('should create a populated character building with only character from primitives', () => {
      const primitives = {
        id: UuidMother.random().value,
        character: CharacterMother.random().toPrimitives(),
        metadata: createMetadata(username, username).toPrimitives()
      };

      const populatedCharacterBuilding =
        PopulatedCharacterBuilding.fromPrimitives(primitives);

      expect(populatedCharacterBuilding.toPrimitives()).toMatchObject({
        ...primitives,
        actor: null,
        scene: null,
        relationshipCircumstances: null
      });
    });

    it('should create a populated character building with only scene from primitives', () => {
      const primitives = {
        id: UuidMother.random().value,
        scene: SceneMother.random().toPrimitives(),
        metadata: createMetadata(username, username).toPrimitives()
      };

      const populatedCharacterBuilding =
        PopulatedCharacterBuilding.fromPrimitives(primitives);

      expect(populatedCharacterBuilding.toPrimitives()).toMatchObject({
        ...primitives,
        actor: null,
        character: null,
        relationshipCircumstances: null
      });
    });

    it('should create a populated character building with only relationshipCircumstances from primitives', () => {
      const primitives = {
        id: UuidMother.random().value,
        relationshipCircumstances: [
          {
            character: CharacterMother.random().toPrimitives(),
            circumstance: SceneCircumstanceMother.random().value
          }
        ],
        metadata: createMetadata(username, username).toPrimitives()
      };

      const populatedCharacterBuilding =
        PopulatedCharacterBuilding.fromPrimitives(primitives);

      expect(populatedCharacterBuilding.toPrimitives()).toMatchObject({
        ...primitives,
        actor: null,
        character: null,
        scene: null
      });
    });
  });
});
