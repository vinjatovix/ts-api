import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { createError } from '../../../shared/domain/errors';
import { Uuid } from '../../../shared/domain/valueObject';
import { BookPages } from './BookPages';
import { BookReleaseDate } from './BookReleaseDate';
import { BookTitle } from './BookTitle';
import { Isbn } from './ISBN';

export class BookPatch extends AggregateRoot {
  readonly id: Uuid;
  readonly title?: BookTitle;
  readonly author?: Uuid;
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
    author?: Uuid;
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
    this.validatePatch();
  }

  private validatePatch() {
    if (
      !(
        this.title ||
        this.author ||
        this.isbn ||
        this.releaseDate ||
        this.pages
      )
    ) {
      throw createError.invalidArgument(
        `${this.constructor.name} has nothing to patch`
      );
    }
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
      ...(author && { author: new Uuid(author) }),
      ...(isbn && { isbn: new Isbn(isbn) }),
      ...(releaseDate && { releaseDate: new BookReleaseDate(releaseDate) }),
      ...(pages && { pages: new BookPages(pages) })
    });
  }
}
