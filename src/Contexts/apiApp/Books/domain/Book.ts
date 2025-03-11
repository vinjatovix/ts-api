import { Nullable } from '../../../shared/domain/Nullable';
import { Uuid, Metadata } from '../../../shared/domain/valueObject';
import { BookBase } from './BookBase';
import { BookPages } from './BookPages';
import { BookReleaseDate } from './BookReleaseDate';
import { BookTitle } from './BookTitle';
import { BookPrimitives } from './interfaces';
import { Isbn } from './ISBN';

interface BookProps {
  id: Uuid;
  title: Nullable<BookTitle>;
  author: Nullable<Uuid>;
  isbn: Nullable<Isbn>;
  releaseDate: Nullable<BookReleaseDate>;
  pages: Nullable<BookPages>;
  metadata: Metadata;
}

export class Book extends BookBase {
  readonly author: Nullable<Uuid>;

  constructor({
    id,
    title,
    author,
    isbn,
    releaseDate,
    pages,
    metadata
  }: BookProps) {
    super({
      id,
      title,
      isbn,
      releaseDate,
      pages,
      metadata
    });
    this.author = author;
  }

  toPrimitives(): BookPrimitives {
    const primitives = {
      ...super.toPrimitives(),
      author: this.author?.value
    };

    return primitives;
  }

  static readonly fromPrimitives = ({
    id,
    title,
    author,
    isbn,
    releaseDate,
    pages,
    metadata
  }: BookPrimitives): Book =>
    new Book({
      id: new Uuid(id),
      title: title ? new BookTitle(title) : null,
      author: author ? new Uuid(author as string) : null,
      isbn: isbn ? new Isbn(isbn) : null,
      releaseDate: releaseDate ? new BookReleaseDate(releaseDate) : null,
      pages: pages ? new BookPages(pages) : null,
      metadata: Metadata.fromPrimitives(metadata)
    });
}
