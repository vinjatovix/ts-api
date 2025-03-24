import { MetadataType } from '../../../shared/application/MetadataType';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Uuid } from '../../../shared/domain/valueObject';
import { Metadata } from '../../../shared/domain/valueObject/Metadata';
import { BookPages } from './BookPages';
import { BookReleaseDate } from './BookReleaseDate';
import { BookTitle } from './BookTitle';
import { Isbn } from './ISBN';

export class Book extends AggregateRoot {
  readonly id: Uuid;
  readonly title: BookTitle;
  readonly author: Uuid;
  readonly isbn: Isbn;
  readonly releaseDate: BookReleaseDate;
  readonly pages: BookPages;
  readonly metadata: Metadata;

  constructor({
    id,
    title,
    author,
    isbn,
    releaseDate,
    pages,
    metadata
  }: {
    id: Uuid;
    title: BookTitle;
    author: Uuid;
    isbn: Isbn;
    releaseDate: BookReleaseDate;
    pages: BookPages;
    metadata: Metadata;
  }) {
    super();
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.releaseDate = releaseDate;
    this.pages = pages;
    this.metadata = metadata;
  }

  toPrimitives() {
    return {
      id: this.id.value,
      title: this.title.value,
      author: this.author.value,
      isbn: this.isbn.value,
      releaseDate: this.releaseDate.value,
      pages: this.pages.value,
      metadata: this.metadata.toPrimitives()
    };
  }

  static fromPrimitives({
    id,
    title,
    author,
    isbn,
    releaseDate,
    pages,
    metadata
  }: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    releaseDate: string;
    pages: number;
    metadata: MetadataType;
  }) {
    return new Book({
      id: new Uuid(id),
      title: new BookTitle(title),
      author: new Uuid(author),
      isbn: new Isbn(isbn),
      releaseDate: new BookReleaseDate(releaseDate),
      pages: new BookPages(pages),
      metadata: Metadata.fromPrimitives(metadata)
    });
  }
}
