import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Nullable } from '../../../shared/domain/Nullable';
import { Uuid } from '../../../shared/domain/valueObject/Uuid';
import { Author, AuthorName } from '../../Authors/domain';
import { BookPages } from './BookPages';
import { BookReleaseDate } from './BookReleaseDate';
import { BookTitle } from './BookTitle';
import { Isbn } from './ISBN';

export class PopulatedBook extends AggregateRoot {
  readonly id: Uuid;
  readonly title: Nullable<BookTitle> = null;
  readonly author: Nullable<Author> = null;
  readonly isbn: Nullable<Isbn> = null;
  readonly releaseDate: Nullable<BookReleaseDate> = null;
  readonly pages: Nullable<BookPages> = null;

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
    author?: Author;
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
      ...(this.title && { title: this.title.value }),
      ...(this.author && {
        author: {
          id: this.author?.id.value,
          ...(this.author?.name && { name: this.author?.name.value })
        }
      }),
      ...(this.isbn && { isbn: this.isbn.value }),
      ...(this.releaseDate && { releaseDate: this.releaseDate.value }),
      ...(this.pages && { pages: this.pages.value })
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
    author?: {
      id: string;
      name: string;
    };
    isbn?: string;
    releaseDate?: string;
    pages?: number;
  }) {
    return new PopulatedBook({
      id: new Uuid(id),
      ...(title && { title: new BookTitle(title) }),
      ...(author && {
        author: new Author({
          id: new Uuid(author.id),
          name: new AuthorName(author.name)
        }),
        ...(isbn && { isbn: new Isbn(isbn) }),
        ...(releaseDate && { releaseDate: new BookReleaseDate(releaseDate) }),
        ...(pages && { pages: new BookPages(pages) })
      })
    });
  }
}
