import { AggregateRoot } from '../../../shared/domain';
import { Nullable } from '../../../shared/domain/types';
import { Uuid } from '../../../shared/domain/valueObject';
import { User, Username } from '../../Auth/domain';
import { CharacterInPopulatedVO } from '../../Characters/domain/interfaces';
import { CharacterMapper } from '../../Characters/infrastructure';
import { SceneCircumstance } from '../../Scenes/domain';
import { SceneInPopulatedVO } from '../../Scenes/domain/interfaces';
import { SceneMapper } from '../../Scenes/infrastructure';
import {
  CharacterBuildingBase,
  CharacterBuildingBaseProps
} from './CharacterBuildingBase';
import { CharacterBuildingPrimitives } from './interfaces';

export interface PopulatedCharacterBuildingProps
  extends CharacterBuildingBaseProps {
  actor?: Nullable<Uuid | Partial<User>>;
  character?: Nullable<CharacterInPopulatedVO>;
  scene?: Nullable<SceneInPopulatedVO>;
  relationshipCircumstances?: Array<
    Nullable<{
      character: CharacterInPopulatedVO;
      circumstance: Nullable<SceneCircumstance>;
    }>
  >;
}

export class PopulatedCharacterBuilding extends CharacterBuildingBase {
  readonly actor: Nullable<Uuid | Partial<User>>;
  readonly character: Nullable<CharacterInPopulatedVO>;
  readonly scene: Nullable<SceneInPopulatedVO>;
  readonly relationshipCircumstances?: Array<{
    character: CharacterInPopulatedVO;
    circumstance: SceneCircumstance;
  }> | null;

  constructor(props: PopulatedCharacterBuildingProps) {
    super(props);
    this.actor = props.actor ?? null;
    this.character = props.character ?? null;
    this.scene = props.scene ?? null;
    this.relationshipCircumstances = Array.isArray(
      props.relationshipCircumstances
    )
      ? props.relationshipCircumstances.filter(
          (
            item
          ): item is {
            character: CharacterInPopulatedVO;
            circumstance: SceneCircumstance;
          } => item !== null
        )
      : null;
  }

  toPrimitives() {
    return {
      ...super.toPrimitives(),
      character: this.serializeEntity(this.character),
      scene: this.serializeEntity(this.scene),
      actor: this.serializeEntity(this.actor),
      relationshipCircumstances: this.serializeRelationshipCircumstances()
    } as CharacterBuildingPrimitives;
  }

  private serializeEntity(entity: unknown): unknown {
    if (entity instanceof AggregateRoot) return entity.toPrimitives();
    if (entity instanceof Uuid) return entity.value;
    if (typeof entity === 'object' && entity !== null) {
      const typedEntity = { ...entity } as Record<string, unknown>;
      for (const key of Object.keys(typedEntity)) {
        if (typedEntity[key] instanceof AggregateRoot) {
          typedEntity[key] = typedEntity[key].toPrimitives();
        } else if (
          typedEntity[key] instanceof Uuid ||
          typedEntity[key] instanceof Username
        ) {
          typedEntity[key] = typedEntity[key].value;
        }
      }
      return typedEntity;
    }

    return entity ?? null;
  }

  private serializeRelationshipCircumstances() {
    return (
      this.relationshipCircumstances?.map((item) =>
        item
          ? {
              character: this.serializeEntity(item.character),
              ...(item.circumstance !== null
                ? { circumstance: item.circumstance.value }
                : {})
            }
          : null
      ) ?? null
    );
  }

  static fromPrimitives(
    primitives: CharacterBuildingPrimitives
  ): PopulatedCharacterBuilding {
    const filteredRelationshipCircumstances = Array.isArray(
      primitives.relationshipCircumstances
    )
      ? primitives.relationshipCircumstances.filter((item) => {
          return item.character || item.circumstance;
        })
      : null;

    const actor = getActor(primitives);
    let character = null;
    if (primitives.character) {
      if (typeof primitives.character === 'string') {
        character = new Uuid(primitives.character);
      } else {
        character = new CharacterMapper().map(primitives.character);
      }
    }
    let scene = null;
    if (primitives.scene) {
      if (typeof primitives.scene === 'string') {
        scene = new Uuid(primitives.scene);
      } else {
        scene = new SceneMapper().map(primitives.scene);
      }
    }

    return new PopulatedCharacterBuilding({
      ...super.fromPrimitives(primitives),
      actor,
      character,
      scene,
      relationshipCircumstances: filteredRelationshipCircumstances?.map(
        (item) => ({
          character:
            typeof item.character === 'string'
              ? new Uuid(item.character)
              : new CharacterMapper().map(item.character),
          circumstance: item.circumstance
            ? new SceneCircumstance(item.circumstance)
            : null
        })
      )
    });
  }
}
function getActor(primitives: CharacterBuildingPrimitives) {
  let actor = null;
  if (primitives.actor) {
    if (typeof primitives.actor === 'string') {
      actor = new Uuid(primitives.actor);
    } else {
      actor = {
        id: new Uuid(primitives.actor.id as unknown as string),
        username: new Username(primitives.actor.username as unknown as string)
      };
    }
  }
  return actor;
}
