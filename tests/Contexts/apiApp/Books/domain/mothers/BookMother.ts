import { BookCreatorRequest } from '../../../../../../src/Contexts/apiApp/Books/application';
import {
  Book,
  BookPages,
  BookReleaseDate,
  BookTitle,
  Isbn
} from '../../../../../../src/Contexts/apiApp/Books/domain';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/valueObject';
import { UuidMother } from '../../../../fixtures/shared/domain/mothers/UuidMother';
import { BookPagesMother } from './BookPagesMother';
import { BookReleaseDateMother } from './BookReleaseDateMother';
import { BookTitleMother } from './BookTitleMother';
import { ISBNMother } from './ISBNMother';

export class BookMother {
  static create(
    id: Uuid,
    title: BookTitle,
    author: Uuid,
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
      UuidMother.create(command.author),
      ISBNMother.create(command.isbn),
      new BookReleaseDate(command.releaseDate),
      BookPagesMother.create(command.pages)
    );
  }

  static random(id?: string): Book {
    return this.create(
      id ? UuidMother.create(id) : UuidMother.random(),
      BookTitleMother.random(),
      Uuid.random(),
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
