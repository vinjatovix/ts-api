import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { createError } from '../../../shared/domain/errors';
import { Uuid } from '../../../shared/domain/valueObject';
import { SceneCircumstance } from './SceneCircumstance';

export class ScenePatch extends AggregateRoot {
  readonly id: Uuid;
  readonly description?: SceneCircumstance;
  readonly characters?: Uuid[];

  constructor({
    id,
    description,
    characters
  }: {
    id: Uuid;
    description?: SceneCircumstance;
    characters?: Uuid[];
  }) {
    super();
    this.id = id;
    description && (this.description = description);
    characters && (this.characters = characters);
    this.validatePatch();
  }

  private validatePatch() {
    if (!(this.description || this.characters)) {
      throw createError.invalidArgument(
        `${this.constructor.name} has nothing to patch`
      );
    }
  }

  toPrimitives() {
    return {
      id: this.id.value,
      ...(this.description && { description: this.description.value }),
      ...(this.characters && {
        characters: this.characters.map((char) => char.value)
      })
    };
  }

  static fromPrimitives({
    id,
    description,
    characters
  }: {
    id: string;
    description?: string;
    characters?: string[];
  }): ScenePatch {
    return new ScenePatch({
      id: new Uuid(id),
      ...(description && { description: new SceneCircumstance(description) }),
      ...(characters && {
        characters: characters.map((char) => new Uuid(char))
      })
    });
  }
}
