import { CharacterByQuery } from '../../../../../src/Contexts/apiApp/Characters/application';
import { Character } from '../../../../../src/Contexts/apiApp/Characters/domain';
import { CharacterRepository } from '../../../../../src/Contexts/apiApp/Characters/domain/interfaces';
import { CharacterMother } from '../domain/mothers';

export class CharacterRepositoryMock implements CharacterRepository {
  protected saveMock: jest.Mock;
  public findByQueryMock: jest.Mock;
  private isCharacterFindable: boolean;

  constructor({ find = false }: { find: boolean } = { find: false }) {
    this.isCharacterFindable = find;
    this.saveMock = jest.fn();
    this.findByQueryMock = jest.fn().mockImplementation(() => {
      return this.isCharacterFindable ? [CharacterMother.random()] : [];
    });
  }

  async save(character: Character): Promise<void> {
    this.saveMock(character);
  }

  assertSaveHasBeenCalledWith(expected: Character): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
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
}
