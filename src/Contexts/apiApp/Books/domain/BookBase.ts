import { AggregateRoot } from '../../../shared/domain/';
import { Nullable } from '../../../shared/domain/types';
import { Metadata, Uuid } from '../../../shared/domain/valueObject';
import { BookPages } from './BookPages';
import { BookReleaseDate } from './BookReleaseDate';
import { BookTitle } from './BookTitle';
import { BookPrimitives } from './interfaces';
import { BookBaseProps } from './interfaces/BookBaseProps';
import { Isbn } from './ISBN';

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

  static fromPrimitives({
    id,
    metadata,
    title,
    releaseDate,
    pages,
    isbn
  }: BookPrimitives): BookBase {
    return new this({
      id: new Uuid(id),
      metadata: Metadata.fromPrimitives(metadata),
      title: title ? new BookTitle(title) : null,
      releaseDate: releaseDate ? new BookReleaseDate(releaseDate) : null,
      pages: pages ? new BookPages(pages) : null,
      isbn: isbn ? new Isbn(isbn) : null
    });
  }
}
