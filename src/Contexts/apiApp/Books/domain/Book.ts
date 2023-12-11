import { AggregateRoot } from '../../../shared/domain/AggregateRoot';

import { BookAuthor } from './BookAuthor';
import { BookId } from './BookId';
import { BookPages } from './BookPages';
import { BookReleaseDate } from './BookReleaseDate';
import { BookTitle } from './BookTitle';
import { Isbn } from './ISBN';

export class Book extends AggregateRoot {
  readonly id: BookId;
  readonly title: BookTitle;
  readonly author: BookAuthor;
  readonly isbn: Isbn;
  readonly releaseDate: BookReleaseDate;
  readonly pages: BookPages;

  constructor({
    id,
    title,
    author,
    isbn,
    releaseDate,
    pages
  }: {
    id: BookId;
    title: BookTitle;
    author: BookAuthor;
    isbn: Isbn;
    releaseDate: BookReleaseDate;
    pages: BookPages;
  }) {
    super();
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.releaseDate = releaseDate;
    this.pages = pages;
  }

  toPrimitives() {
    return {
      id: this.id.value,
      title: this.title.value,
      author: this.author.value,
      isbn: this.isbn.value,
      releaseDate: this.releaseDate.value,
      pages: this.pages.value
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
    title: string;
    author: string;
    isbn: string;
    releaseDate: string;
    pages: number;
  }) {
    return new Book({
      id: new BookId(id),
      title: new BookTitle(title),
      author: new BookAuthor(author),
      isbn: new Isbn(isbn),
      releaseDate: new BookReleaseDate(releaseDate),
      pages: new BookPages(pages)
    });
  }
}
