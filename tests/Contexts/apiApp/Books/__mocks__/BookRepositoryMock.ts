import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { BookRepository } from '../../../../../src/Contexts/apiApp/Books/domain/BookRepository';
import { BookMother } from '../domain/BookMother';

export class BookRepositoryMock implements BookRepository {
  private saveMock: jest.Mock;
  private searchMock: jest.Mock;

  constructor() {
    this.saveMock = jest.fn();
    this.searchMock = jest.fn();
  }

  async save(book: Book): Promise<void> {
    this.saveMock(book);
  }

  assertSaveHasBeenCalledWith(expected: Book): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  async search(id: string): Promise<Book | null> {
    if (id === 'not-found') {
      this.searchMock = jest.fn().mockReturnValue(null);
    } else {
      this.searchMock = jest.fn().mockReturnValue(BookMother.random());
    }

    return this.searchMock(id);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.searchMock).toHaveBeenCalledWith(expected);
  }
}
