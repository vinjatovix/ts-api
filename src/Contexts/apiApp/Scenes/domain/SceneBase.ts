import { MetadataType } from '../../../shared/application/MetadataType';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Nullable } from '../../../shared/domain/Nullable';
import { Metadata, Uuid } from '../../../shared/domain/valueObject';
import { Character, PopulatedCharacter } from '../../Characters/domain';
import { ScenePrimitives } from './interfaces';
import { SceneCircumstance } from './SceneCircumstance';

export interface SceneProps {
  id: Uuid;
  description?: Nullable<SceneCircumstance>;
  characters?: Nullable<Array<Uuid | Character | PopulatedCharacter>>;
  metadata: Metadata;
}

interface SceneBasePimitives {
  id: string;
  metadata: MetadataType;
  description?: string;
}

export class SceneBase extends AggregateRoot {
  readonly id: Uuid;
  readonly description: Nullable<SceneCircumstance>;
  readonly metadata: Metadata;

  constructor({ id, description = null, metadata }: SceneProps) {
    super();
    this.id = id;
    this.description = description;
    this.metadata = metadata;
  }

  toPrimitives() {
    const primitives: ScenePrimitives = {
      id: this.id.value,
      metadata: this.metadata.toPrimitives()
    };

    if (this.description) {
      primitives.description = this.description.value;
    }

    return primitives;
  }

  static fromPrimitives({ id, description, metadata }: SceneBasePimitives) {
    return new this({
      id: new Uuid(id),
      metadata: Metadata.fromPrimitives(metadata),
      description: description ? new SceneCircumstance(description) : null
    });
  }
}
