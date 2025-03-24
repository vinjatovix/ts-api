import { CharacterBuildingCreatorRequest } from '../../../../../../src/Contexts/apiApp/CharacterBuildings/application/interfaces';
import {
  CharacterBuilding,
  CharacterBuildingProps,
  RelationshipCircumstance
} from '../../../../../../src/Contexts/apiApp/CharacterBuildings/domain';
import { Center } from '../../../../../../src/Contexts/apiApp/CharacterBuildings/domain/Center';
import { Metadata } from '../../../../../../src/Contexts/shared/domain/valueObject';
import { random } from '../../../../fixtures/shared';
import { UuidMother } from '../../../../fixtures/shared/domain/mothers';
import { SceneCircumstanceMother } from '../../../Scenes/domain/mothers';

export class CharacterBuildingMother {
  static create(props: CharacterBuildingProps) {
    return new CharacterBuilding(props);
  }

  static from(
    command: CharacterBuildingCreatorRequest,
    username: string
  ): CharacterBuilding {
    return this.create({
      id: UuidMother.create(command.id),
      actor: UuidMother.create(command.actor),
      character: UuidMother.create(command.character),
      scene: UuidMother.create(command.scene),
      center: new Center(command.center),
      sceneCircumstances: SceneCircumstanceMother.create(
        command.sceneCircumstances
      ),
      previousCircumstances: SceneCircumstanceMother.create(
        command.previousCircumstances
      ),
      relationshipCircumstances: command.relationshipCircumstances.map(
        RelationshipCircumstance.fromPrimitives
      ),
      metadata: new Metadata({
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: username,
        updatedBy: username
      })
    });
  }

  static random({
    id,
    actor,
    character,
    scene,
    center,
    sceneCircumstances,
    previousCircumstances,
    relationshipCircumstances
  }: {
    id?: string;
    actor?: string;
    character?: string;
    scene?: string;
    center?: string;
    sceneCircumstances?: string;
    previousCircumstances?: string;
    relationshipCircumstances?: { character: string; circumstance: string }[];
  } = {}): CharacterBuilding {
    return this.create({
      id: id ? UuidMother.create(id) : UuidMother.random(),
      actor: actor ? UuidMother.create(actor) : UuidMother.random(),
      character: character ? UuidMother.create(character) : UuidMother.random(),
      scene: scene ? UuidMother.create(scene) : UuidMother.random(),
      center: center
        ? new Center(center)
        : new Center(
            random.arrayElement([
              'mental',
              'emotional',
              'instinctive'
            ]) as string
          ),
      sceneCircumstances: sceneCircumstances
        ? SceneCircumstanceMother.create(sceneCircumstances)
        : SceneCircumstanceMother.random(),
      previousCircumstances: previousCircumstances
        ? SceneCircumstanceMother.create(previousCircumstances)
        : SceneCircumstanceMother.random(),
      relationshipCircumstances: relationshipCircumstances
        ? relationshipCircumstances.map((rc) =>
            RelationshipCircumstance.fromPrimitives(rc)
          )
        : [],
      metadata: new Metadata({
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: UuidMother.random().value,
        updatedBy: UuidMother.random().value
      })
    });
  }
}
