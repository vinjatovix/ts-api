import { BookFinderRequest } from '../../../../../src/Contexts/apiApp/Books/application/BookFinderRequest';
import { BookId } from '../../../../../src/Contexts/apiApp/Books/domain/BookId';
import { BookIdMother } from '../domain/BookIdMother';

export class BookFinderRequestMother {
  static create(id: BookId): BookFinderRequest {
    return {
      id: id.value
    };
  }

  static random(): BookFinderRequest {
    return this.create(BookIdMother.random());
  }

  static inexistentId(): BookFinderRequest {
    return {
      id: 'not-found'
    };
  }
}
