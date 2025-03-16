import { Nullable } from '../../../shared/domain/types';
import { Uuid, Metadata } from '../../../shared/domain/valueObject';
import { SceneBase } from './SceneBase';
import { SceneCircumstance } from './SceneCircumstance';
import { ScenePrimitives } from './interfaces';

export interface SceneProps {
  id: Uuid;
  description: Nullable<SceneCircumstance>;
  characters: Nullable<Uuid[]>;
  metadata: Metadata;
}

export class Scene extends SceneBase {
  readonly characters: Nullable<Uuid[]>;

  constructor({ id, description, characters, metadata }: SceneProps) {
    super({
      id,
      description,
      metadata
    });
    this.characters = characters;
  }

  toPrimitives(): ScenePrimitives {
    return {
      ...super.toPrimitives(),
      characters: this.characters?.map((characterId) => characterId.value)
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
      characters: Array.isArray(characters)
        ? characters.map((charId) => new Uuid(charId as string))
        : null,
      metadata: Metadata.fromPrimitives(metadata)
    });
}
