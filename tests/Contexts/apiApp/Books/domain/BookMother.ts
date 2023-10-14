import { BookId } from '../../../../../src/Contexts/apiApp/Books/domain/BookId';
import { BookTitle } from '../../../../../src/Contexts/apiApp/Books/domain/BookTitle';
import { BookAuthor } from '../../../../../src/Contexts/apiApp/Books/domain/BookAuthor';
import { ISBN } from '../../../../../src/Contexts/apiApp/Books/domain/ISBN';
import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { BookIdMother } from './BookIdMother';
import { BookCreatorRequest } from '../../../../../src/Contexts/apiApp/Books/application/BookCreatorRequest';
import { BookTitleMother } from './BookTitleMother';
import { BookAuthorMother } from './BookAuthorMother';
import { ISBNMother } from './ISBNMother';
import { random } from '../../../fixtures/shared';
import { BookReleaseDate } from '../../../../../src/Contexts/apiApp/Books/domain/BookReleaseDate';
import { BookReleaseDateMother } from './BookReleaseDateMother';

export class BookMother {
  static create(
    id: BookId,
    title: BookTitle,
    author: BookAuthor,
    isbn: ISBN,
    releaseDate: BookReleaseDate,
    pages: number
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
      command.pages
    );
  }

  static random(): Book {
    return this.create(
      BookIdMother.random(),
      BookTitleMother.random(),
      BookAuthorMother.random(),
      ISBNMother.random(),
      BookReleaseDateMother.random(),
      random.integer()
    );
  }
}
