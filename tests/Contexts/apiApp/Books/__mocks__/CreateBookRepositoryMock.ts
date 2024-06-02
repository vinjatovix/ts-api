import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { BookRepositoryMock } from './BookRepositoryMock';

export class CreateBookRepositoryMock extends BookRepositoryMock {
  protected findMock: jest.Mock;

  constructor() {
    super();
    this.findMock = jest.fn();
  }

  async search(id: string): Promise<Book | null> {
    this.findMock = jest.fn().mockReturnValue(null);

    return this.findMock(id);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.findMock).toHaveBeenCalledWith(expected);
  }
}
