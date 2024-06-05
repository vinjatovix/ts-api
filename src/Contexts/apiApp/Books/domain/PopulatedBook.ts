import { MetadataType } from '../../../shared/application/MetadataType';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Nullable } from '../../../shared/domain/Nullable';
import { Metadata } from '../../../shared/domain/valueObject/Metadata';
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
    metadata: Metadata;
    title?: BookTitle;
    author?: Author;
    isbn?: Isbn;
    releaseDate?: BookReleaseDate;
    pages?: BookPages;
  }) {
    super();
    this.id = id;
    this.metadata = metadata;
    title && (this.title = title);
    author && (this.author = author);
    isbn && (this.isbn = isbn);
    releaseDate && (this.releaseDate = releaseDate);
    pages && (this.pages = pages);
  }

  toPrimitives() {
    return {
      id: this.id.value,
      metadata: this.metadata.toPrimitives(),
      ...(this.title && { title: this.title.value }),
      ...(this.author && {
        author: {
          id: this.author?.id.value,
          metadata: this.author?.metadata.toPrimitives(),
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
    metadata,
    title,
    author,
    isbn,
    releaseDate,
    pages
  }: {
    id: string;
    metadata: MetadataType;
    title?: string;
    author?: {
      id: string;
      name: string;
      metadata: MetadataType;
    };
    isbn?: string;
    releaseDate?: string;
    pages?: number;
  }) {
    return new PopulatedBook({
      id: new Uuid(id),
      metadata: Metadata.fromPrimitives(metadata),
      ...(title && { title: new BookTitle(title) }),
      ...(isbn && { isbn: new Isbn(isbn) }),
      ...(releaseDate && { releaseDate: new BookReleaseDate(releaseDate) }),
      ...(pages && { pages: new BookPages(pages) }),
      ...(author && {
        author: new Author({
          id: new Uuid(author.id),
          name: new AuthorName(author.name),
          metadata: Metadata.fromPrimitives(author.metadata)
        })
      })
    });
  }
}
