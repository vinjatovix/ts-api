import { Nullable } from '../../../shared/domain/types';
import { Character, PopulatedCharacter } from '../../Characters/domain';
import { CharacterMapper } from '../../Characters/infrastructure';
import { CharacterType } from '../../Characters/infrastructure/types';
import { SceneBase, SceneProps } from './SceneBase';
import { ScenePrimitives } from './interfaces';

export class PopulatedScene extends SceneBase {
  readonly characters: Nullable<Array<Character | PopulatedCharacter>>;

  constructor({
    characters,
    ...props
  }: SceneProps & {
    characters: Array<Character | PopulatedCharacter>;
  }) {
    super(props);
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
    characters,
    ...primitives
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
      ...super.fromPrimitives(primitives),
      characters: charInstances
    });
  }

  get _id(): string {
    return this.id.value;
  }
}
