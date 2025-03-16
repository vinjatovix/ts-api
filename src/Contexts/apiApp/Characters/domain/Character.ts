import { Uuid, Metadata } from '../../../shared/domain/valueObject';
import { Nullable } from '../../../shared/domain/types';
import { CharacterBase } from './CharacterBase';
import { CharacterName } from './CharacterName';
import { CharacterPrimitives } from './interfaces';

interface CharacterProps {
  id: Uuid;
  name: Nullable<CharacterName>;
  book: Nullable<Uuid>;
  metadata: Metadata;
}

export class Character extends CharacterBase {
  readonly book: Nullable<Uuid>;

  constructor({ id, name, book, metadata }: CharacterProps) {
    super({ id, name, metadata });
    this.book = book;
  }

  toPrimitives(): CharacterPrimitives {
    const primitives = {
      ...super.toPrimitives(),
      book: this.book?.value
    };

    return primitives;
  }

  static readonly fromPrimitives = ({
    id,
    name,
    book,
    metadata
  }: CharacterPrimitives): Character =>
    new Character({
      id: new Uuid(id),
      name:
        name !== null && name !== undefined ? new CharacterName(name) : null,
      book:
        book !== null && book !== undefined ? new Uuid(book as string) : null,
      metadata: Metadata.fromPrimitives(metadata)
    });
}
