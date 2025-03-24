import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Nullable } from '../../../shared/domain/Nullable';
import { Metadata, Uuid } from '../../../shared/domain/valueObject';
import { BookPages } from './BookPages';
import { BookReleaseDate } from './BookReleaseDate';
import { BookTitle } from './BookTitle';
import { BookPrimitives } from './interfaces';
import { Isbn } from './ISBN';

export interface BookBaseProps {
  id: Uuid;
  title?: Nullable<BookTitle>;
  releaseDate?: Nullable<BookReleaseDate>;
  pages?: Nullable<BookPages>;
  isbn?: Nullable<Isbn>;
  metadata: Metadata;
}

export class BookBase extends AggregateRoot {
  readonly id: Uuid;
  readonly metadata: Metadata;
  readonly title: Nullable<BookTitle>;
  readonly releaseDate: Nullable<BookReleaseDate>;
  readonly pages: Nullable<BookPages>;
  readonly isbn: Nullable<Isbn>;

  constructor({
    id,
    title = null,
    metadata,
    releaseDate = null,
    pages = null,
    isbn = null
  }: BookBaseProps) {
    super();

    this.id = id;
    this.metadata = metadata;
    this.title = title;
    this.releaseDate = releaseDate;
    this.pages = pages;
    this.isbn = isbn;
  }

  toPrimitives(): BookPrimitives {
    const { id, metadata, title, releaseDate, pages, isbn } = this;

    const primitives: BookPrimitives = {
      id: id.value,
      metadata: metadata.toPrimitives(),
      ...(title && { title: title.value }),
      ...(releaseDate && { releaseDate: releaseDate.value.toISOString() }),
      ...(pages && { pages: pages.value }),
      ...(isbn && { isbn: isbn.value })
    };

    return primitives;
  }
}
