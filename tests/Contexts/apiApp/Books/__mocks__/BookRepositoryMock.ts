import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { BookRepository } from '../../../../../src/Contexts/apiApp/Books/domain/BookRepository';
import { BookMother } from '../domain/BookMother';

export class BookRepositoryMock implements BookRepository {
  private saveMock: jest.Mock;
  private findMock: jest.Mock;
  private findAllMock: jest.Mock;
  private removeMock: jest.Mock;

  constructor() {
    this.saveMock = jest.fn();
    this.findMock = jest.fn();
    this.findAllMock = jest.fn();
    this.removeMock = jest.fn();
  }

  async save(book: Book): Promise<void> {
    this.saveMock(book);
  }

  assertSaveHasBeenCalledWith(expected: Book): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  async find(id: string): Promise<Book | null> {
    if (id === 'not-found') {
      this.findMock = jest.fn().mockReturnValue(null);
    } else {
      this.findMock = jest.fn().mockReturnValue(BookMother.random());
    }

    return this.findMock(id);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.findMock).toHaveBeenCalledWith(expected);
  }

  async findAll(): Promise<Book[]> {
    const bookList = BookMother.randomList(3);
    this.findAllMock = jest.fn().mockReturnValue(bookList);

    return this.findAllMock();
  }

  assertSearchAllHasBeenCalled(): void {
    expect(this.findAllMock).toHaveBeenCalled();
  }

  async remove(id: string): Promise<void> {
    this.removeMock(id);
  }

  assertRemoveHasBeenCalledWith(expected: string): void {
    expect(this.removeMock).toHaveBeenCalledWith(expected);
  }
}
