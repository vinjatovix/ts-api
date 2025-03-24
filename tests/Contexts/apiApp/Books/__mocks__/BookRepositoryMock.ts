import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { BookByQuery } from '../../../../../src/Contexts/apiApp/Books/domain/BookByQuery';
import { BookPatch } from '../../../../../src/Contexts/apiApp/Books/domain/BookPatch';
import { BookRepository } from '../../../../../src/Contexts/apiApp/Books/domain/BookRepository';

import { BookMother } from '../domain/mothers/BookMother';

export class BookRepositoryMock implements BookRepository {
  protected saveMock: jest.Mock;
  private updateMock: jest.Mock;
  protected findMock: jest.Mock;
  private findAllMock: jest.Mock;
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

  findByQuery(query: BookByQuery): Promise<Book[]> {
    return this.findByQueryMock(query);
  }

  assertFindByQueryHasBeenCalledWith(expected: BookByQuery): void {
    expect(this.findByQueryMock).toHaveBeenCalledWith(expected);
  }
}
