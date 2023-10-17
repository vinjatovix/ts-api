import { BookId } from '../../../../../src/Contexts/apiApp/Books/domain/BookId';
import { BookTitle } from '../../../../../src/Contexts/apiApp/Books/domain/BookTitle';
import { BookAuthor } from '../../../../../src/Contexts/apiApp/Books/domain/BookAuthor';
import { Isbn } from '../../../../../src/Contexts/apiApp/Books/domain/ISBN';
import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { BookIdMother } from './BookIdMother';
import { BookCreatorRequest } from '../../../../../src/Contexts/apiApp/Books/application/BookCreatorRequest';
import { BookTitleMother } from './BookTitleMother';
import { BookAuthorMother } from './BookAuthorMother';
import { ISBNMother } from './ISBNMother';
import { BookReleaseDate } from '../../../../../src/Contexts/apiApp/Books/domain/BookReleaseDate';
import { BookReleaseDateMother } from './BookReleaseDateMother';
import { BookPages } from '../../../../../src/Contexts/apiApp/Books/domain/BookPages';
import { BookPagesMother } from './BookPagesMother';

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
}
