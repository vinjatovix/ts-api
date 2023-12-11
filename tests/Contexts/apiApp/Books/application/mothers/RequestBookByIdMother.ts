import { BookId } from '../../../../../../src/Contexts/apiApp/Books/domain/BookId';
import { RequestById } from '../../../../../../src/Contexts/shared/application/RequestById';
import { BookIdMother } from '../../domain/mothers/BookIdMother';

export class RequestBookByIdMother {
  static create(id: BookId): RequestById {
    return {
      id: id.value
    };
  }

  static random(): RequestById {
    return this.create(BookIdMother.random());
  }

  static inexistentId(): RequestById {
    return {
      id: 'not-found'
    };
  }
}
