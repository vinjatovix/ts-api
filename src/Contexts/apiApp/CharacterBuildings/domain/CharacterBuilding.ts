import { Nullable } from '../../../shared/domain/types';
import { Uuid } from '../../../shared/domain/valueObject';
import {
  CharacterBuildingBase,
  CharacterBuildingBaseProps
} from './CharacterBuildingBase';
import {
  CharacterBuildingPrimitives,
  RelationshipCircumstancePrimitives
} from './interfaces';
import { RelationshipCircumstance } from './RelationshipCircumstance';

export interface CharacterBuildingProps extends CharacterBuildingBaseProps {
  actor: Nullable<Uuid>;
  character: Nullable<Uuid>;
  scene: Nullable<Uuid>;
  relationshipCircumstances: Nullable<RelationshipCircumstance[]>;
}

export class CharacterBuilding extends CharacterBuildingBase {
  readonly actor: Nullable<Uuid>;
  readonly character: Nullable<Uuid>;
  readonly scene: Nullable<Uuid>;
  readonly relationshipCircumstances: Nullable<RelationshipCircumstance[]>;

  constructor(props: CharacterBuildingProps) {
    super(props);
    this.actor = props.actor;
    this.character = props.character;
    this.scene = props.scene;
    this.relationshipCircumstances = props.relationshipCircumstances;
  }

  toPrimitives() {
    return {
      ...super.toPrimitives(),
      actor: this.actor?.value,
      character: this.character?.value,
      scene: this.scene?.value,
      relationshipCircumstances: this.relationshipCircumstances?.map((rc) =>
        rc.toPrimitives()
      )
    };
  }

  static fromPrimitives(
    primitives: CharacterBuildingPrimitives
  ): CharacterBuilding {
    return new CharacterBuilding({
      ...super.fromPrimitives(primitives),
      actor: primitives.actor ? new Uuid(primitives.actor as string) : null,
      character: primitives.character
        ? new Uuid(primitives.character as string)
        : null,
      scene: primitives.scene ? new Uuid(primitives.scene as string) : null,
      relationshipCircumstances: primitives.relationshipCircumstances
        ? primitives.relationshipCircumstances.map(
            (rc: RelationshipCircumstancePrimitives) =>
              RelationshipCircumstance.fromPrimitives(rc)
          )
        : null
    });
  }
}
