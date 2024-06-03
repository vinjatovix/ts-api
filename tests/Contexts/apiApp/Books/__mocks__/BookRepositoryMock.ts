import { RequestOptions } from '../../../../../src/apps/apiApp/shared/interfaces';
import {
  Book,
  BookPatch
} from '../../../../../src/Contexts/apiApp/Books/domain';
import {
  BookByQuery,
  BookRepository
} from '../../../../../src/Contexts/apiApp/Books/domain/interfaces';
import { BookMother } from '../domain/mothers/BookMother';

export class BookRepositoryMock implements BookRepository {
  protected saveMock: jest.Mock;
  private updateMock: jest.Mock;
  protected findMock: jest.Mock;
  public findAllMock: jest.Mock;
  private removeMock: jest.Mock;
  public findByQueryMock: jest.Mock;

  constructor() {
    this.saveMock = jest.fn();
    this.updateMock = jest.fn();
    this.findMock = jest.fn();
    this.findAllMock = jest.fn();
    this.removeMock = jest.fn();
    this.findByQueryMock = jest.fn();
  }

  async save(book: Book): Promise<void> {
    this.saveMock(book);
  }

  assertSaveHasBeenCalledWith(expected: Book): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  async update(book: BookPatch): Promise<void> {
    this.updateMock(book);
  }

  assertUpdateHasBeenCalledWith(expected: BookPatch): void {
    expect(this.updateMock).toHaveBeenCalledWith(expected);
  }

  async search(id: string): Promise<Book | null> {
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

  async findAll(options?: Partial<RequestOptions>): Promise<Book[]> {
    const bookList = BookMother.randomList(3);
    this.findAllMock = jest.fn().mockReturnValue(bookList);

    return this.findAllMock(options);
  }

  assertSearchAllHasBeenCalled(): void {
    expect(this.findAllMock).toHaveBeenCalled();
  }

  assertSearchAllHasBeenCalledWith(options: Partial<RequestOptions>): void {
    expect(this.findAllMock).toHaveBeenCalledWith(options);
  }

  async remove(id: string): Promise<void> {
    this.removeMock(id);
  }

  assertRemoveHasBeenCalledWith(expected: string): void {
    expect(this.removeMock).toHaveBeenCalledWith(expected);
  }

  findByQuery(query: BookByQuery): Promise<Book[]> {
    return this.findByQueryMock(query);
  }

  assertFindByQueryHasBeenCalledWith(expected: BookByQuery): void {
    expect(this.findByQueryMock).toHaveBeenCalledWith(expected);
  }
}
