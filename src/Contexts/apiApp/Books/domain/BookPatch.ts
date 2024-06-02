import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Uuid } from '../../../shared/domain/value-object/Uuid';

import { BookAuthor } from './BookAuthor';
import { BookPages } from './BookPages';
import { BookReleaseDate } from './BookReleaseDate';
import { BookTitle } from './BookTitle';
import { Isbn } from './ISBN';

export class BookPatch extends AggregateRoot {
  readonly id: Uuid;
  readonly title?: BookTitle;
  readonly author?: BookAuthor;
  readonly isbn?: Isbn;
  readonly releaseDate?: BookReleaseDate;
  readonly pages?: BookPages;

  constructor({
    id,
    title,
    author,
    isbn,
    releaseDate,
    pages
  }: {
    id: Uuid;
    title?: BookTitle;
    author?: BookAuthor;
    isbn?: Isbn;
    releaseDate?: BookReleaseDate;
    pages?: BookPages;
  }) {
    super();
    this.id = id;
    title && (this.title = title);
    author && (this.author = author);
    isbn && (this.isbn = isbn);
    releaseDate && (this.releaseDate = releaseDate);
    pages && (this.pages = pages);
  }

  toPrimitives() {
    return {
      id: this.id.value,
      ...(this.title?.value && { title: this.title.value }),
      ...(this.author?.value && { author: this.author.value }),
      ...(this.isbn?.value && { isbn: this.isbn.value }),
      ...(this.releaseDate?.value && { releaseDate: this.releaseDate.value }),
      ...(this.pages?.value && { pages: this.pages.value })
    };
  }

  static fromPrimitives({
    id,
    title,
    author,
    isbn,
    releaseDate,
    pages
  }: {
    id: string;
    title?: string;
    author?: string;
    isbn?: string;
    releaseDate?: string;
    pages?: number;
  }): BookPatch {
    return new BookPatch({
      id: new Uuid(id),
      ...(title && { title: new BookTitle(title) }),
      ...(author && { author: new BookAuthor(author) }),
      ...(isbn && { isbn: new Isbn(isbn) }),
      ...(releaseDate && { releaseDate: new BookReleaseDate(releaseDate) }),
      ...(pages && { pages: new BookPages(pages) })
    });
  }
}
