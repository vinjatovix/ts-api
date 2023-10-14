import { BookAuthor } from './BookAuthor';
import { BookId } from './BookId';
import { BookTitle } from './BookTitle';
import { ISBN } from './ISBN';

export class Book {
  readonly id: BookId;
  readonly title: BookTitle;
  readonly author: BookAuthor;
  readonly isbn: ISBN;
  readonly releaseDate: string;
  readonly pages: number;

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
    isbn: ISBN;
    releaseDate: string;
    pages: number;
  }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.releaseDate = releaseDate;
    this.pages = pages;
  }
}
