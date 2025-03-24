import { Nullable } from '../../../shared/domain/types';
import { Metadata, Uuid } from '../../../shared/domain/valueObject';
import { Character, PopulatedCharacter } from '../../Characters/domain';
import { CharacterMapper } from '../../Characters/infrastructure';
import { CharacterType } from '../../Characters/infrastructure/types';
import { SceneBase, SceneProps } from './SceneBase';
import { SceneCircumstance } from './SceneCircumstance';
import { ScenePrimitives } from './interfaces';

export class PopulatedScene extends SceneBase {
  readonly characters: Nullable<Array<Character | PopulatedCharacter>>;

  constructor({
    id,
    description,
    characters,
    metadata
  }: Omit<SceneProps, 'characters'> & {
    characters: Array<Character | PopulatedCharacter>;
  }) {
    super({ id, description, metadata });
    this.characters = characters ?? null;
  }

  toPrimitives() {
    const primitives = super.toPrimitives();

    if (this.characters?.length) {
      primitives.characters = this.characters.map((c) => c.toPrimitives());
    }

    return primitives;
  }

  static fromPrimitives({
    id,
    description,
    metadata,
    characters
  }: ScenePrimitives): PopulatedScene {
    if (
      !characters ||
      !Array.isArray(characters) ||
      (characters.length && typeof characters[0] !== 'object')
    ) {
      throw new Error(
        `${this.constructor.name} cannot be created without populated characters`
      );
    }

    const charInstances = characters?.map((character) =>
      new CharacterMapper().map(character as unknown as CharacterType)
    );

    return new PopulatedScene({
      id: new Uuid(id),
      metadata: Metadata.fromPrimitives(metadata),
      description: description ? new SceneCircumstance(description) : null,
      characters: charInstances
    });
  }

  get _id(): string {
    return this.id.value;
  }
}
