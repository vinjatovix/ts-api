import { createError } from '../../../shared/domain/errors';
import { Uuid } from '../../../shared/domain/valueObject';
import { SceneCircumstance } from '../../Scenes/domain';
import { ActionUnit, ActionUnitPrimitives } from './ActionUnit';
import { Center } from './Center';
import { RelationshipCircumstancePrimitives } from './interfaces';
import { RelationshipCircumstance } from './RelationshipCircumstance';

export class CharacterBuildingPatch {
  readonly id: Uuid;
  readonly actor?: Uuid;
  readonly character?: Uuid;
  readonly scene?: Uuid;
  readonly center?: Center;
  readonly sceneCircumstances?: SceneCircumstance;
  readonly previousCircumstances?: SceneCircumstance;
  readonly relationshipCircumstances?: RelationshipCircumstance[];
  readonly actionUnits?: ActionUnit[];

  constructor({
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
    actor?: Uuid;
    character?: Uuid;
    scene?: Uuid;
    center?: Center;
    sceneCircumstances?: SceneCircumstance;
    previousCircumstances?: SceneCircumstance;
    relationshipCircumstances?: RelationshipCircumstance[];
    actionUnits?: ActionUnit[];
  }) {
    this.id = id;
    actor && (this.actor = actor);
    character && (this.character = character);
    scene && (this.scene = scene);
    center && (this.center = center);
    sceneCircumstances && (this.sceneCircumstances = sceneCircumstances);
    previousCircumstances &&
      (this.previousCircumstances = previousCircumstances);
    relationshipCircumstances &&
      (this.relationshipCircumstances = relationshipCircumstances);
    actionUnits && (this.actionUnits = actionUnits);
    this.validatePatch();
  }

  private validatePatch() {
    if (
      !(
        this.actor ||
        this.character ||
        this.scene ||
        this.center ||
        this.sceneCircumstances ||
        this.previousCircumstances ||
        this.relationshipCircumstances ||
        this.actionUnits
      )
    ) {
      throw createError.invalidArgument(
        `${this.constructor.name} has nothing to patch`
      );
    }
  }

  toPrimitives() {
    return {
      id: this.id.value,
      ...(this.actor && { actor: this.actor.value }),
      ...(this.character && { character: this.character.value }),
      ...(this.scene && { scene: this.scene.value }),
      ...(this.center && { center: this.center.value }),
      ...(this.sceneCircumstances && {
        sceneCircumstances: this.sceneCircumstances.value
      }),
      ...(this.previousCircumstances && {
        previousCircumstances: this.previousCircumstances.value
      }),
      ...(this.relationshipCircumstances && {
        relationshipCircumstances: this.relationshipCircumstances.map((rc) =>
          rc.toPrimitives()
        )
      }),
      ...(this.actionUnits && {
        actionUnits: this.actionUnits.map((au) => au.toPrimitives())
      })
    };
  }

  static fromPrimitives({
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
    id: string;
    actor?: string;
    character?: string;
    scene?: string;
    center?: string;
    sceneCircumstances?: string;
    previousCircumstances?: string;
    relationshipCircumstances?: RelationshipCircumstancePrimitives[];
    actionUnits?: ActionUnitPrimitives[];
  }): CharacterBuildingPatch {
    return new CharacterBuildingPatch({
      id: new Uuid(id),
      ...(actor && { actor: new Uuid(actor) }),
      ...(character && { character: new Uuid(character) }),
      ...(scene && { scene: new Uuid(scene) }),
      ...(center && { center: new Center(center) }),
      ...(sceneCircumstances && {
        sceneCircumstances: new SceneCircumstance(sceneCircumstances)
      }),
      ...(previousCircumstances && {
        previousCircumstances: new SceneCircumstance(previousCircumstances)
      }),
      ...(relationshipCircumstances && {
        relationshipCircumstances: relationshipCircumstances.map((rc) =>
          RelationshipCircumstance.fromPrimitives(rc)
        )
      }),
      ...(actionUnits && {
        actionUnits: actionUnits.map((au) => ActionUnit.fromPrimitives(au))
      })
    });
  }
}
