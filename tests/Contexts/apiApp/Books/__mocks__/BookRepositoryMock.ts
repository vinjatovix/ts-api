import { RequestOptions } from '../../../../../src/apps/apiApp/shared/interfaces';
import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { BookByQuery } from '../../../../../src/Contexts/apiApp/Books/application/interfaces';
import {
  Book,
  BookPatch
} from '../../../../../src/Contexts/apiApp/Books/domain';
import { BookRepository } from '../../../../../src/Contexts/apiApp/Books/domain/interfaces';
import { BookMother } from '../domain/mothers';

export class BookRepositoryMock implements BookRepository {
  private readonly saveMock: jest.Mock;
  private readonly updateMock: jest.Mock;
  private readonly findMock: jest.Mock;
  private readonly findAllMock: jest.Mock;
  private readonly removeMock: jest.Mock;
  private readonly findByQueryMock: jest.Mock;
  private isFindable: boolean;

  constructor({ find }: { find: boolean } = { find: false }) {
    this.isFindable = find;
    this.saveMock = jest.fn();
    this.updateMock = jest.fn();
    this.findMock = jest.fn().mockImplementation(() => {
      return this.isFindable ? BookMother.random() : null;
    });
    this.findAllMock = jest.fn().mockImplementation(() => {
      return this.isFindable ? BookMother.randomList(3) : [];
    });
    this.removeMock = jest.fn();
    this.findByQueryMock = jest.fn().mockImplementation(() => {
      return this.isFindable ? [BookMother.random()] : [];
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
    this.isFindable = findable;
  }
}
