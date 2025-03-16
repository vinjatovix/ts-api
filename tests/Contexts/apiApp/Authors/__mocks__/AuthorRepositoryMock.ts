import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import {
  Author,
  AuthorPatch
} from '../../../../../src/Contexts/apiApp/Authors/domain';
import { AuthorRepository } from '../../../../../src/Contexts/apiApp/Authors/domain/interfaces';
import { AuthorMother } from '../domain/mothers';

export class AuthorRepositoryMock implements AuthorRepository {
  private readonly saveMock: jest.Mock;
  private readonly updateMock: jest.Mock;
  private readonly searchMock: jest.Mock;
  private readonly findAllMock: jest.Mock;
  private readonly removeMock: jest.Mock;
  private isFindable: boolean;

  constructor({ find }: { find: boolean } = { find: false }) {
    this.isFindable = find;
    this.saveMock = jest.fn();
    this.updateMock = jest.fn();
    this.searchMock = jest.fn().mockImplementation(() => {
      return this.isFindable ? AuthorMother.random() : null;
    });
    this.findAllMock = jest.fn().mockImplementation(() => {
      return this.isFindable ? AuthorMother.randomList(3) : [];
    });
    this.removeMock = jest.fn();
  }

  async save(author: Author): Promise<void> {
    this.saveMock(author);
  }

  assertSaveHasBeenCalledWith(expected: Author): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  async update(author: AuthorPatch, user: Username): Promise<void> {
    this.updateMock(author, user);
  }

  assertUpdateHasBeenCalledWith(expected: AuthorPatch, user: Username): void {
    expect(this.updateMock).toHaveBeenCalledWith(expected, user);
  }

  async search(authorId: string): Promise<Author | null> {
    return this.searchMock(authorId);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.searchMock).toHaveBeenCalledWith(expected);
  }

  async findAll(): Promise<Author[]> {
    return this.findAllMock();
  }

  assertFindAllHasBeenCalled(): void {
    expect(this.findAllMock).toHaveBeenCalled();
  }

  async remove(authorId: string): Promise<void> {
    this.removeMock(authorId);
  }

  assertRemoveHasBeenCalledWith(expected: string): void {
    expect(this.removeMock).toHaveBeenCalledWith(expected);
  }

  setFindable(findable: boolean): void {
    this.isFindable = findable;
  }
}
