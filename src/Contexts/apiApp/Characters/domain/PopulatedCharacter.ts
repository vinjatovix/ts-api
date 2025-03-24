import { Uuid, Metadata } from '../../../shared/domain/valueObject';
import { Book, PopulatedBook } from '../../Books/domain';
import { CharacterName } from './CharacterName';
import { CharacterBase } from './CharacterBase';
import { Nullable } from '../../../shared/domain/Nullable';
import { CharacterPrimitives } from './interfaces';
import { BookMapper } from '../../Books/infraestructure/BookMapper';
import { BookType } from '../../Books/infraestructure/types';

export class PopulatedCharacter extends CharacterBase {
  readonly book: Nullable<Book | PopulatedBook>;

  constructor({
    id,
    name,
    book,
    metadata
  }: {
    id: Uuid;
    metadata: Metadata;
    name?: Nullable<CharacterName>;
    book?: Nullable<Book | PopulatedBook>;
  }) {
    super({
      id,
      name,
      metadata
    });
    this.book = book ?? null;
  }

  toPrimitives() {
    const primitives = super.toPrimitives();

    if (this.book instanceof PopulatedBook || this.book instanceof Book) {
      primitives.book = this.book.toPrimitives();
    }

    return primitives;
  }

  static fromPrimitives({
    id,
    metadata,
    name,
    book
  }: CharacterPrimitives): PopulatedCharacter {
    const bookInstance = BookMapper.map(book as unknown as BookType);

    return new this({
      id: new Uuid(id),
      metadata: Metadata.fromPrimitives(metadata),
      name: name ? new CharacterName(name) : undefined,
      book: (bookInstance as Book | PopulatedBook) ?? undefined
    });
  }

  get _id(): string {
    return this.id.value;
  }
}
