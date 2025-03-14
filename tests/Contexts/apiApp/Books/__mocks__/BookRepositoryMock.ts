import { RequestOptions } from '../../../../../src/apps/apiApp/shared/interfaces';
import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
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
  private isBookFindable: boolean;

  constructor({ find }: { find: boolean } = { find: false }) {
    this.isBookFindable = find;
    this.saveMock = jest.fn();
    this.updateMock = jest.fn();
    this.findMock = jest.fn().mockImplementation(() => {
      return this.isBookFindable ? BookMother.random() : null;
    });
    this.findAllMock = jest.fn().mockImplementation(() => {
      return this.isBookFindable ? BookMother.randomList(3) : [];
    });
    this.removeMock = jest.fn();
    this.findByQueryMock = jest.fn().mockImplementation(() => {
      return this.isBookFindable ? [BookMother.random()] : [];
    });
  }

  async save(book: Book): Promise<void> {
    this.saveMock(book);
  }

  assertSaveHasBeenCalledWith(expected: Book): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  async update(book: BookPatch, user: Username): Promise<void> {
    this.updateMock(book, user);
  }

  assertUpdateHasBeenCalledWith(expected: BookPatch, user: Username): void {
    expect(this.updateMock).toHaveBeenCalledWith(expected, user);
  }

  async search(id: string): Promise<Book | null> {
    return this.findMock(id);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.findMock).toHaveBeenCalledWith(expected);
  }

  async findAll(options?: Partial<RequestOptions>): Promise<Book[]> {
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

  setFindable(findable: boolean): void {
    this.isBookFindable = findable;
  }
}
