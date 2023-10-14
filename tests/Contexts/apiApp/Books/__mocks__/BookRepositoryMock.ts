import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { BookRepository } from '../../../../../src/Contexts/apiApp/Books/domain/BookRepository';

export class BookRepositoryMock implements BookRepository {
  private saveMock: jest.Mock;

  constructor() {
    this.saveMock = jest.fn();
  }

  async save(book: Book): Promise<void> {
    this.saveMock(book);
  }

  assertSaveHasBeenCalledWith(expected: Book): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }
}
