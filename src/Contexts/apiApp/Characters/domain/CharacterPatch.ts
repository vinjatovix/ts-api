import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { createError } from '../../../shared/domain/errors';
import { Uuid } from '../../../shared/domain/valueObject';
import { CharacterName } from './CharacterName';

export class CharacterPatch extends AggregateRoot {
  readonly id: Uuid;
  readonly name?: CharacterName;
  readonly book?: Uuid;

  constructor({
    id,
    name,
    book
  }: {
    id: Uuid;
    name?: CharacterName;
    book?: Uuid;
  }) {
    super();
    this.id = id;
    name && (this.name = name);
    book && (this.book = book);
    this.validatePatch();
  }

  private validatePatch() {
    if (!(this.name || this.book)) {
      throw createError.invalidArgument(
        `${this.constructor.name} has nothing to patch`
      );
    }
  }

  toPrimitives() {
    return {
      id: this.id.value,
      ...(this.book?.value && { book: this.book.value }),
      ...(this.name?.value && { name: this.name.value })
    };
  }

  static fromPrimitives({
    id,
    name,
    book
  }: {
    id: string;
    name?: string;
    book?: string;
  }): CharacterPatch {
    return new CharacterPatch({
      id: new Uuid(id),
      ...(name && { name: new CharacterName(name) }),
      ...(book && { book: new Uuid(book) })
    });
  }
}
