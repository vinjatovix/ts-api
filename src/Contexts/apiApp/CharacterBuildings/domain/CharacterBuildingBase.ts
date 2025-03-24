import { AggregateRoot } from '../../../shared/domain';
import { Nullable } from '../../../shared/domain/types';
import { Metadata, Uuid } from '../../../shared/domain/valueObject';
import { SceneCircumstance } from '../../Scenes/domain';
import { ActionUnit } from './ActionUnit';
import { Center } from './Center';
import { CharacterBuildingPrimitives } from './interfaces';

export interface CharacterBuildingBaseProps {
  id: Uuid;
  metadata: Metadata;
  center?: Nullable<Center>;
  sceneCircumstances?: Nullable<SceneCircumstance>;
  previousCircumstances?: Nullable<SceneCircumstance>;
  actionUnits?: Nullable<ActionUnit[]>;
}

export class CharacterBuildingBase extends AggregateRoot {
  readonly id: Uuid;
  readonly metadata: Metadata;
  readonly center: Nullable<Center>;
  readonly sceneCircumstances: Nullable<SceneCircumstance>;
  readonly previousCircumstances: Nullable<SceneCircumstance>;
  readonly actionUnits: Nullable<ActionUnit[]>;

  constructor({
    id,
    metadata,
    center = null,
    sceneCircumstances = null,
    previousCircumstances = null,
    actionUnits = null
  }: CharacterBuildingBaseProps) {
    super();
    this.id = id;
    this.metadata = metadata;
    this.center = center;
    this.sceneCircumstances = sceneCircumstances;
    this.previousCircumstances = previousCircumstances;
    this.actionUnits = actionUnits;
  }

  toPrimitives(): CharacterBuildingPrimitives {
    return {
      id: this.id.value,
      metadata: this.metadata.toPrimitives(),
      center: this.center?.value,
      sceneCircumstances: this.sceneCircumstances?.value,
      previousCircumstances: this.previousCircumstances?.value,
      actionUnits: this.actionUnits?.map((au) => au.toPrimitives())
    };
  }

  static fromPrimitives(
    primitives: CharacterBuildingPrimitives
  ): CharacterBuildingBase {
    return new CharacterBuildingBase({
      id: new Uuid(primitives.id),
      metadata: Metadata.fromPrimitives(primitives.metadata),
      center: primitives.center ? new Center(primitives.center) : null,
      sceneCircumstances: primitives.sceneCircumstances
        ? new SceneCircumstance(primitives.sceneCircumstances)
        : null,
      previousCircumstances: primitives.previousCircumstances
        ? new SceneCircumstance(primitives.previousCircumstances)
        : null,
      actionUnits: primitives.actionUnits?.map((au) =>
        ActionUnit.fromPrimitives(au)
      )
    });
  }
}
