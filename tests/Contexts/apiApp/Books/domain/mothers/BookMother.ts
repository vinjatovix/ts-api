import { BookCreatorRequest } from '../../../../../../src/Contexts/apiApp/Books/application';
import {
  Book,
  BookAuthor,
  BookId,
  BookPages,
  BookReleaseDate,
  BookTitle,
  Isbn
} from '../../../../../../src/Contexts/apiApp/Books/domain';

import { BookAuthorMother } from './BookAuthorMother';
import { BookIdMother } from './BookIdMother';
import { BookPagesMother } from './BookPagesMother';
import { BookReleaseDateMother } from './BookReleaseDateMother';
import { BookTitleMother } from './BookTitleMother';
import { ISBNMother } from './ISBNMother';

export class BookMother {
  static create(
    id: BookId,
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
      BookIdMother.create(command.id),
      BookTitleMother.create(command.title),
      BookAuthorMother.create(command.author),
      ISBNMother.create(command.isbn),
      new BookReleaseDate(command.releaseDate),
      BookPagesMother.create(command.pages)
    );
  }

  static random(): Book {
    return this.create(
      BookIdMother.random(),
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
