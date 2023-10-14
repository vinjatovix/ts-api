import { BookCreatorRequest } from '../../../../../src/Contexts/apiApp/Books/application/BookCreatorRequest';
import { BookAuthor } from '../../../../../src/Contexts/apiApp/Books/domain/BookAuthor';
import { BookId } from '../../../../../src/Contexts/apiApp/Books/domain/BookId';
import { BookReleaseDate } from '../../../../../src/Contexts/apiApp/Books/domain/BookReleaseDate';
import { BookTitle } from '../../../../../src/Contexts/apiApp/Books/domain/BookTitle';
import { ISBN } from '../../../../../src/Contexts/apiApp/Books/domain/ISBN';
import { random } from '../../../fixtures/shared';
import { BookAuthorMother } from '../domain/BookAuthorMother';
import { BookIdMother } from '../domain/BookIdMother';
import { BookReleaseDateMother } from '../domain/BookReleaseDateMother';
import { BookTitleMother } from '../domain/BookTitleMother';
import { ISBNMother } from '../domain/ISBNMother';

export class BookCreatorRequestMother {
  static create(
    id: BookId,
    title: BookTitle,
    author: BookAuthor,
    isbn: ISBN,
    releaseDate: BookReleaseDate,
    pages: number
  ): BookCreatorRequest {
    return {
      id: id.value,
      title: title.value,
      author: author.value,
      isbn: isbn.value,
      releaseDate: releaseDate.value,
      pages
    };
  }

  static random(): BookCreatorRequest {
    return this.create(
      BookIdMother.random(),
      BookTitleMother.random(),
      BookAuthorMother.random(),
      ISBNMother.random(),
      BookReleaseDateMother.random(),
      random.integer()
    );
  }

  static invalidValue(keys: string[]): BookCreatorRequest {
    const id = keys.includes('id')
      ? BookIdMother.invalidValue()
      : BookIdMother.random().value;
    const title = keys.includes('title')
      ? BookTitleMother.invalidValue()
      : BookTitleMother.random().value;
    const author = keys.includes('author')
      ? BookAuthorMother.invalidValue()
      : BookAuthorMother.random().value;
    const isbn = keys.includes('isbn')
      ? ISBNMother.invalidValue()
      : ISBNMother.random().value;
    const releaseDate = keys.includes('releaseDate')
      ? BookReleaseDateMother.invalidValue()
      : BookReleaseDateMother.random().value;
    const pages = keys.includes('pages') ? NaN : random.integer();

    return {
      id,
      title,
      author,
      isbn,
      releaseDate,
      pages
    };
  }
}
