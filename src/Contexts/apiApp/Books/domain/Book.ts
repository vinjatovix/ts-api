import { BookAuthor } from './BookAuthor';
import { BookId } from './BookId';
import { BookPages } from './BookPages';
import { BookReleaseDate } from './BookReleaseDate';
import { BookTitle } from './BookTitle';
import { Isbn } from './ISBN';

export class Book {
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
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.releaseDate = releaseDate;
    this.pages = pages;
  }

  asPrimitives() {
    return {
      id: this.id.value,
      title: this.title.value,
      author: this.author.value,
      isbn: this.isbn.value,
      releaseDate: this.releaseDate.value,
      pages: this.pages.value
    };
  }
}
