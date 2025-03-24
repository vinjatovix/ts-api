import { createError } from '../../../shared/domain/errors';
import { Book, PopulatedBook } from '../../Books/domain';
import { BookMapper } from '../../Books/infrastructure';
import { CharacterBase, CharacterProps } from './CharacterBase';
import { CharacterPrimitives } from './interfaces';

export class PopulatedCharacter extends CharacterBase {
  readonly book: Book | PopulatedBook;

  constructor({
    id,
    name,
    book,
    metadata
  }: Omit<CharacterProps, 'book'> & {
    book: Book | PopulatedBook;
  }) {
    super({ id, name, metadata });
    this.book = book;
  }

  toPrimitives() {
    const primitives = super.toPrimitives();

    if (this.book) {
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
    if (typeof book !== 'object') {
      throw createError.invalidArgument(
        `${this.constructor.name} cannot be created without a valid book`
      );
    }
    const bookInstance = new BookMapper().map(book);

    return new this({
      ...super.fromPrimitives({ id, name, metadata }),
      book: bookInstance
    });
  }

  get _id(): string {
    return this.id.value;
  }
}
