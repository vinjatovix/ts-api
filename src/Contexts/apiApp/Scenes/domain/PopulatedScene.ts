import { Nullable } from '../../../shared/domain/Nullable';
import { Metadata, Uuid } from '../../../shared/domain/valueObject';
import { Character, PopulatedCharacter } from '../../Characters/domain';
import { CharacterMapper } from '../../Characters/infraestructure/persistence/CharacterMapper';
import { CharacterType } from '../../Characters/infraestructure/types';
import { ScenePrimitives } from './interfaces';
import { SceneBase, SceneProps } from './SceneBase';
import { SceneCircumstance } from './SceneCircumstance';

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
    const charInstances = characters?.map((character) =>
      CharacterMapper.map(character as unknown as CharacterType)
    );
    return new PopulatedScene({
      id: new Uuid(id),
      metadata: Metadata.fromPrimitives(metadata),
      description: description ? new SceneCircumstance(description) : null,
      // ...(description && { description: new SceneCircumstance(description) }),
      characters:
        charInstances?.filter(
          (char): char is Character | PopulatedCharacter => char !== null
        ) || []
    });
  }

  get _id(): string {
    return this.id.value;
  }
}
