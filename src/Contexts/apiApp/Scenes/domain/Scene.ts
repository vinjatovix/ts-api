import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Nullable } from '../../../shared/domain/Nullable';
import { Uuid, Metadata } from '../../../shared/domain/valueObject';
import { SceneCircumstance } from './SceneCircumstance';
import { ScenePrimitives } from './interfaces';

export interface SceneProps {
  id: Uuid;
  description?: Nullable<SceneCircumstance>;
  characters: Uuid[];
  metadata: Metadata;
}

export class Scene extends AggregateRoot {
  readonly id: Uuid;
  readonly description: Nullable<SceneCircumstance>;
  readonly characters: Uuid[];
  readonly metadata: Metadata;

  constructor({ id, description, characters, metadata }: SceneProps) {
    super();
    this.id = id;
    this.description = description ?? null;
    this.characters = characters;
    this.metadata = metadata;
  }

  toPrimitives(): ScenePrimitives {
    return {
      id: this.id.value,
      description: this.description ? this.description.value : null,
      characters: this.characters.map((characterId) => characterId.value),
      metadata: this.metadata.toPrimitives()
    };
  }

  static readonly fromPrimitives = ({
    id,
    description,
    characters,
    metadata
  }: ScenePrimitives): Scene =>
    new Scene({
      id: new Uuid(id),
      description: description ? new SceneCircumstance(description) : null,
      characters: characters.map((charId) => new Uuid(charId)),
      metadata: Metadata.fromPrimitives(metadata)
    });
}
