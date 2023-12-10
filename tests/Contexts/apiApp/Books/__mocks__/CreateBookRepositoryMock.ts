import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { BookRepository } from '../../../../../src/Contexts/apiApp/Books/domain/BookRepository';

export class CreateBookRepositoryMock implements BookRepository {
  private saveMock: jest.Mock;
  private findMock: jest.Mock;

  constructor() {
    this.saveMock = jest.fn();
    this.findMock = jest.fn();
  }

  async save(book: Book): Promise<void> {
    this.saveMock(book);
  }

  assertSaveHasBeenCalledWith(expected: Book): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  async search(id: string): Promise<Book | null> {
    this.findMock = jest.fn().mockReturnValue(null);

    return this.findMock(id);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.findMock).toHaveBeenCalledWith(expected);
  }

  findAll(): Promise<Book[]> {
    throw new Error('Method not implemented.');
  }
  remove(_bookId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
