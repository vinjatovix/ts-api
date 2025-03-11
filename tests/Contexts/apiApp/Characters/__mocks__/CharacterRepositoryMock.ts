import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { CharacterByQuery } from '../../../../../src/Contexts/apiApp/Characters/application';
import {
  Character,
  PopulatedCharacter
} from '../../../../../src/Contexts/apiApp/Characters/domain';
import { CharacterPatch } from '../../../../../src/Contexts/apiApp/Characters/domain/CharacterPatch';
import { CharacterRepository } from '../../../../../src/Contexts/apiApp/Characters/domain/interfaces';
import { CharacterMother } from '../domain/mothers';

export class CharacterRepositoryMock implements CharacterRepository {
  private readonly saveMock: jest.Mock;
  private readonly updateMock: jest.Mock;
  private readonly findByQueryMock: jest.Mock;
  private readonly findAllMock: jest.Mock;
  protected findMock: jest.Mock;
  private readonly removeMock: jest.Mock;
  private isCharacterFindable: boolean;

  constructor({ find = false }: { find: boolean } = { find: false }) {
    this.isCharacterFindable = find;
    this.saveMock = jest.fn();
    this.updateMock = jest.fn();
    this.findByQueryMock = jest.fn().mockImplementation(() => {
      return this.isCharacterFindable ? [CharacterMother.random()] : [];
    });
    this.findAllMock = jest.fn().mockReturnValue([CharacterMother.random()]);
    this.findMock = jest.fn().mockImplementation(() => {
      return this.isCharacterFindable ? CharacterMother.random() : null;
    });
    this.removeMock = jest.fn();
  }

  async save(character: Character): Promise<void> {
    this.saveMock(character);
  }

  assertSaveHasBeenCalledWith(expected: Character): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  async update(character: CharacterPatch, user: Username): Promise<void> {
    this.updateMock(character, user);
  }

  assertUpdateHasBeenCalledWith(
    expected: CharacterPatch,
    user: Username
  ): void {
    expect(this.updateMock).toHaveBeenCalledWith(expected, user);
  }

  async findByQuery(query: CharacterByQuery): Promise<Character[]> {
    return this.findByQueryMock(query);
  }

  assertFindByQueryHasBeenCalledWith(expected: CharacterByQuery): void {
    expect(this.findByQueryMock).toHaveBeenCalledWith(expected);
  }

  setFindable(findable: boolean): void {
    this.isCharacterFindable = findable;
  }

  async findAll(): Promise<Character[]> {
    return this.findAllMock();
  }

  assertFindAllHasBeenCalled(): void {
    expect(this.findAllMock).toHaveBeenCalled();
  }

  async search(
    id: string
  ): Promise<Partial<Character | PopulatedCharacter> | null> {
    return this.findMock(id);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.findMock).toHaveBeenCalledWith(expected);
  }

  async remove(id: string): Promise<void> {
    this.removeMock(id);
  }

  assertRemoveHasBeenCalledWith(expected: string): void {
    expect(this.removeMock).toHaveBeenCalledWith(expected);
  }
}
