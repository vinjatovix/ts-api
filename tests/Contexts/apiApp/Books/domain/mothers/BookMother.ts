import { BookCreatorRequest } from '../../../../../../src/Contexts/apiApp/Books/application';
import {
  Book,
  BookAuthor,
  BookPages,
  BookReleaseDate,
  BookTitle,
  Isbn
} from '../../../../../../src/Contexts/apiApp/Books/domain';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/value-object/Uuid';
import { UuidMother } from '../../../../fixtures/shared/domain/mothers/UuidMother';

import { BookAuthorMother } from './BookAuthorMother';
import { BookPagesMother } from './BookPagesMother';
import { BookReleaseDateMother } from './BookReleaseDateMother';
import { BookTitleMother } from './BookTitleMother';
import { ISBNMother } from './ISBNMother';

export class BookMother {
  static create(
    id: Uuid,
    title: BookTitle,
    author: BookAuthor,
    isbn: Isbn,
    releaseDate: BookReleaseDate,
    pages: BookPages
  ) {
    return new Book({
      id,
      title,
      author,
      isbn,
      releaseDate,
      pages
    });
  }

  static from(command: BookCreatorRequest): Book {
    return this.create(
      UuidMother.create(command.id),
      BookTitleMother.create(command.title),
      BookAuthorMother.create(command.author),
      ISBNMother.create(command.isbn),
      new BookReleaseDate(command.releaseDate),
      BookPagesMother.create(command.pages)
    );
  }

  static random(id?: string): Book {
    return this.create(
      id ? UuidMother.create(id) : UuidMother.random(),
      BookTitleMother.random(),
      BookAuthorMother.random(),
      ISBNMother.random(),
      BookReleaseDateMother.random(),
      BookPagesMother.random()
    );
  }

  static randomList(length: number): Book[] {
    const list: Book[] = [];
    for (let i = 0; i < length; i++) {
      list.push(this.random());
    }

    return list;
  }
}
