import { BookCreatorRequest } from '../../../../../../src/Contexts/apiApp/Books/application';
import {
  Book,
  BookPages,
  BookReleaseDate,
  BookTitle,
  Isbn
} from '../../../../../../src/Contexts/apiApp/Books/domain';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/valueObject';
import { Metadata } from '../../../../../../src/Contexts/shared/domain/valueObject/Metadata';
import { UuidMother } from '../../../../fixtures/shared/domain/mothers/UuidMother';
import { UserMother } from '../../../Auth/domain/mothers';
import { BookPagesMother } from './BookPagesMother';
import { BookReleaseDateMother } from './BookReleaseDateMother';
import { BookTitleMother } from './BookTitleMother';
import { ISBNMother } from './ISBNMother';

const user = UserMother.random().username.value;
const metadata = new Metadata({
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: user,
  updatedBy: user
});

export class BookMother {
  static create(
    id: Uuid,
    title: BookTitle,
    author: Uuid,
    isbn: Isbn,
    releaseDate: BookReleaseDate,
    pages: BookPages,
    metadata: Metadata
  ) {
    return new Book({
      id,
      title,
      author,
      isbn,
      releaseDate,
      pages,
      metadata
    });
  }

  static from(command: BookCreatorRequest, username: string): Book {
    return this.create(
      UuidMother.create(command.id),
      BookTitleMother.create(command.title),
      UuidMother.create(command.author),
      ISBNMother.create(command.isbn),
      new BookReleaseDate(command.releaseDate),
      BookPagesMother.create(command.pages),
      new Metadata({
        createdAt: new Date(),
        createdBy: username,
        updatedAt: new Date(),
        updatedBy: username
      })
    );
  }

  static random(id?: string): Book {
    return this.create(
      id ? UuidMother.create(id) : UuidMother.random(),
      BookTitleMother.random(),
      Uuid.random(),
      ISBNMother.random(),
      BookReleaseDateMother.random(),
      BookPagesMother.random(),
      metadata
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
