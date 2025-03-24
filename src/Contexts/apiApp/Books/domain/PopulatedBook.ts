import { Nullable } from '../../../shared/domain/Nullable';
import { Metadata, Uuid } from '../../../shared/domain/valueObject';
import { Author } from '../../Authors/domain';
import { BookBase, BookBaseProps } from './BookBase';
import { BookPages } from './BookPages';
import { BookReleaseDate } from './BookReleaseDate';
import { BookTitle } from './BookTitle';
import { BookPrimitives } from './interfaces';
import { Isbn } from './ISBN';

interface PopulatedBookProps extends BookBaseProps {
  author?: Author;
}

export class PopulatedBook extends BookBase {
  readonly author: Nullable<Author>;

  constructor({
    id,
    title,
    author,
    isbn,
    releaseDate,
    pages,
    metadata
  }: PopulatedBookProps) {
    super({
      id,
      title,
      isbn,
      releaseDate,
      pages,
      metadata
    });
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
    const isAuthorValid = author && typeof author === 'object' && author.id;

    return new PopulatedBook({
      id: new Uuid(id),
      metadata: Metadata.fromPrimitives(metadata),
      title: title ? new BookTitle(title) : undefined,
      isbn: isbn ? new Isbn(isbn) : undefined,
      releaseDate: releaseDate ? new BookReleaseDate(releaseDate) : undefined,
      pages: pages ? new BookPages(pages) : undefined,
      author: isAuthorValid
        ? Author.fromPrimitives({
            id: author.id,
            name: author.name ?? undefined,
            metadata: author.metadata
          })
        : undefined
    });
  }
}
