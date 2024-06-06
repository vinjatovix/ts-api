import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import {
  Author,
  AuthorPatch,
  AuthorRepository
} from '../../../../../src/Contexts/apiApp/Authors/domain';
import { AuthorMother } from '../domain/mothers/AuthorMother';

export class AuthorRepositoryMock implements AuthorRepository {
  private saveMock: jest.Mock;
  private updateMock: jest.Mock;
  public searchMock: jest.Mock;
  private findAllMock: jest.Mock;
  private removeMock: jest.Mock;

  constructor() {
    this.saveMock = jest.fn();
    this.updateMock = jest.fn();
    this.searchMock = jest.fn();
    this.findAllMock = jest.fn();
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
    if (authorId === 'not-found') {
      this.searchMock = jest.fn().mockReturnValue(null);
    } else {
      this.searchMock = jest
        .fn()
        .mockReturnValue(AuthorMother.random(authorId));
    }

    return this.searchMock(authorId);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.searchMock).toHaveBeenCalledWith(expected);
  }

  async findAll(): Promise<Author[]> {
    const authorList = AuthorMother.randomList(3);
    this.findAllMock = jest.fn().mockReturnValue(authorList);

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
}
