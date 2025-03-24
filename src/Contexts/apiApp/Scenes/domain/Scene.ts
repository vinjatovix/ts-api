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

  constructor({ characters, ...props }: SceneProps) {
    super(props);
    this.characters = characters;
  }

  toPrimitives(): ScenePrimitives {
    return {
      ...super.toPrimitives(),
      characters: this.characters?.map((characterId) => characterId.value)
    };
  }

  static readonly fromPrimitives = ({
    characters,
    ...primitives
  }: ScenePrimitives & { characters?: string[] | null }): Scene =>
    new Scene({
      ...super.fromPrimitives(primitives),
      characters: characters
        ? characters.map((characterId) => new Uuid(characterId))
        : null
    });
}
