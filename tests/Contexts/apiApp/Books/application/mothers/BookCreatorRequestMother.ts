import { BookCreatorRequest } from '../../../../../../src/Contexts/apiApp/Books/application';
import {
  BookAuthor,
  BookId,
  BookPages,
  BookReleaseDate,
  BookTitle,
  Isbn
} from '../../../../../../src/Contexts/apiApp/Books/domain';

import {
  BookAuthorMother,
  BookIdMother,
  BookPagesMother,
  BookReleaseDateMother,
  BookTitleMother,
  ISBNMother
} from '../../domain/mothers';

export class BookCreatorRequestMother {
  static create(
    id: BookId,
    title: BookTitle,
    author: BookAuthor,
    isbn: Isbn,
    releaseDate: BookReleaseDate,
    pages: BookPages
  ): BookCreatorRequest {
    return {
      id: id.value,
      title: title.value,
      author: author.value,
      isbn: isbn.value,
      releaseDate: releaseDate.value.toISOString(),
      pages: pages.value
    };
  }

  static random(): BookCreatorRequest {
    return this.create(
      BookIdMother.random(),
      BookTitleMother.random(),
      BookAuthorMother.random(),
      ISBNMother.random(),
      BookReleaseDateMother.random(),
      BookPagesMother.random()
    );
  }

  static invalidValue(keys: string[]): BookCreatorRequest {
    const id = keys.includes('id')
      ? BookIdMother.invalidValue()
      : BookIdMother.random().value;
    const title = keys.includes('title')
      ? (BookTitleMother.invalidValue() as string)
      : BookTitleMother.random().value;
    const author = keys.includes('author')
      ? BookAuthorMother.invalidValue()
      : BookAuthorMother.random().value;
    const isbn = keys.includes('isbn')
      ? ISBNMother.invalidValue()
      : ISBNMother.random().value;
    const releaseDate = keys.includes('releaseDate')
      ? BookReleaseDateMother.invalidValue()
      : BookReleaseDateMother.random().value.toISOString();
    const pages = keys.includes('pages')
      ? (BookPagesMother.invalidType() as number)
      : BookPagesMother.random().value;

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
