import { createError } from '../../../shared/domain/errors';
import { Nullable } from '../../../shared/domain/types';
import { Metadata, Uuid } from '../../../shared/domain/valueObject';
import { Author } from '../../Authors/domain';
import { BookBase } from './BookBase';
import { BookPages } from './BookPages';
import { BookReleaseDate } from './BookReleaseDate';
import { BookTitle } from './BookTitle';
import { Isbn } from './ISBN';
import { BookPrimitives, PopulatedBookProps } from './interfaces';

export class PopulatedBook extends BookBase {
  readonly author: Nullable<Author>;

  constructor({ author, ...props }: PopulatedBookProps) {
    super(props);
    this.author = author || null;
  }

  toPrimitives(): BookPrimitives {
    return {
      ...super.toPrimitives(),
      ...(this.author && { author: this.author.toPrimitives() })
    };
  }

  static fromPrimitives({
    id,
    metadata,
    title,
    author,
    isbn,
    releaseDate,
    pages
  }: BookPrimitives) {
    if (!author || typeof author === 'string') {
      throw createError.invalidArgument(
        `Cannot create a populated book without a valid author`
      );
    }

    return new PopulatedBook({
      id: new Uuid(id),
      metadata: Metadata.fromPrimitives(metadata),
      title: title ? new BookTitle(title) : undefined,
      isbn: isbn ? new Isbn(isbn) : undefined,
      releaseDate: releaseDate ? new BookReleaseDate(releaseDate) : undefined,
      pages: pages ? new BookPages(pages) : undefined,
      author: Author.fromPrimitives({
        id: author.id,
        name: author.name ?? undefined,
        metadata: author.metadata
      })
    });
  }
}
