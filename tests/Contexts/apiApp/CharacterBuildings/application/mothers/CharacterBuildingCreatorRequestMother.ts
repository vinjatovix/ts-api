import {
  StringValueObject,
  Uuid
} from '../../../../../../src/Contexts/shared/domain/valueObject';
import { CharacterBuildingCreatorRequest } from '../../../../../../src/Contexts/apiApp/CharacterBuildings/application/interfaces/CharacterBuildingCreatorRequest';
import { SceneCircumstance } from '../../../../../../src/Contexts/apiApp/Scenes/domain';
import { RelationshipCircumstance } from '../../../../../../src/Contexts/apiApp/CharacterBuildings/domain';
import { SceneCircumstanceMother } from '../../../Scenes/domain/mothers';
import { Center } from '../../../../../../src/Contexts/apiApp/CharacterBuildings/domain/Center';
import { random } from '../../../../fixtures/shared';
import { ActionUnit } from '../../../../../../src/Contexts/apiApp/CharacterBuildings/domain/ActionUnit';

export class CharacterBuildingCreatorRequestMother {
  static create({
    id,
    actor,
    character,
    scene,
    center,
    sceneCircumstances,
    previousCircumstances,
    relationshipCircumstances,
    actionUnits
  }: {
    id: Uuid;
    actor: Uuid;
    character: Uuid;
    scene: Uuid;
    center: Center;
    sceneCircumstances: SceneCircumstance;
    previousCircumstances: SceneCircumstance;
    relationshipCircumstances: RelationshipCircumstance[];
    actionUnits?: ActionUnit[];
  }): CharacterBuildingCreatorRequest {
    return {
      id: id.value,
      actor: actor.value,
      character: character.value,
      scene: scene.value,
      center: center.value,
      sceneCircumstances: sceneCircumstances.value,
      previousCircumstances: previousCircumstances.value,
      relationshipCircumstances: relationshipCircumstances.map((rc) => {
        const primitives = rc.toPrimitives();
        return {
          ...primitives,
          circumstance: primitives.circumstance ?? ''
        };
      }),
      actionUnits: actionUnits?.map((au) => au.toPrimitives()) ?? []
    };
  }

  static random(id?: string): CharacterBuildingCreatorRequest {
    return this.create({
      id: id ? new Uuid(id) : Uuid.random(),
      actor: Uuid.random(),
      character: Uuid.random(),
      scene: Uuid.random(),
      center: new Center(
        random.arrayElement(['mental', 'emotional', 'instinctive']) as string
      ),
      sceneCircumstances: SceneCircumstanceMother.random(),
      previousCircumstances: SceneCircumstanceMother.random(),
      relationshipCircumstances: [
        new RelationshipCircumstance({
          character: Uuid.random(),
          circumstance: SceneCircumstanceMother.random()
        })
      ],
      actionUnits: [
        new ActionUnit({
          action: new StringValueObject(random.word()),
          strategies: [new StringValueObject(random.word())]
        })
      ]
    });
  }
}
