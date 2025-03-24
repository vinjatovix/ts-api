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

  constructor({ book, ...props }: CharacterProps) {
    super(props);
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
    book,
    ...primitives
  }: CharacterPrimitives & { book?: string | null }): Character =>
    new Character({
      ...super.fromPrimitives(primitives),
      book: typeof book === 'string' ? new Uuid(book) : null
    });
}
