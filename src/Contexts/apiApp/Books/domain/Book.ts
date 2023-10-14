import { Uuid } from '../../../shared/domain/value-object/Uuid';

export class Book {
  readonly id: Uuid;
  readonly title: string;
  readonly author: string;
  readonly isbn: string;
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
    id: Uuid;
    title: string;
    author: string;
    isbn: string;
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
