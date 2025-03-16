import { BookCreatorRequest } from '../../../../../../src/Contexts/apiApp/Books/application/interfaces';
import {
  BookPages,
  BookReleaseDate,
  BookTitle,
  Isbn
} from '../../../../../../src/Contexts/apiApp/Books/domain';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/valueObject';
import { UuidMother } from '../../../../fixtures/shared/domain/mothers';
import {
  BookPagesMother,
  BookReleaseDateMother,
  BookTitleMother,
  ISBNMother
} from '../../domain/mothers';

export class BookCreatorRequestMother {
  static create(
    id: Uuid,
    title: BookTitle,
    author: Uuid,
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

  static random(id?: string): BookCreatorRequest {
    return this.create(
      id ? UuidMother.create(id) : UuidMother.random(),
      BookTitleMother.random(),
      UuidMother.random(),
      ISBNMother.random(),
      BookReleaseDateMother.random(),
      BookPagesMother.random()
    );
  }

  static invalidValue(keys: string[]): BookCreatorRequest {
    const id = keys.includes('id')
      ? UuidMother.invalidValue()
      : UuidMother.random().value;
    const title = keys.includes('title')
      ? (BookTitleMother.invalidValue() as string)
      : BookTitleMother.random().value;
    const author = keys.includes('author')
      ? UuidMother.invalidValue()
      : UuidMother.random().value;
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
