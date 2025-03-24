import { ObjectId } from 'bson';
import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import {
  Character,
  CharacterPatch
} from '../../../../../src/Contexts/apiApp/Characters/domain';
import { CharacterByQuery } from '../../../../../src/Contexts/apiApp/Characters/application/interfaces';
import { CharacterRepository } from '../../../../../src/Contexts/apiApp/Characters/domain/interfaces';
import { CharacterMother } from '../domain/mothers';
import { BaseRepositoryMock } from '../../shared/__mocks__/BaseRepositoryMock';

export class CharacterRepositoryMock
  extends BaseRepositoryMock<Character, CharacterPatch, CharacterByQuery>
  implements CharacterRepository
{
  constructor({ find = false }: { find?: boolean } = { find: false }) {
    super({ find }, [CharacterMother.random()]);
  }

  protected getId(character: Character): string {
    return character.id.value;
  }

  protected defaultFindByQuery(query: CharacterByQuery): Character[] {
    const foundCharacters = this.storage.filter((character: Character) => {
      const { id, _id, book } = query;
      return (
        (id && character.id.value === id) ||
        _id?.$in?.includes(character.id.value as unknown as ObjectId) ||
        (book && character.book?.value === book)
      );
    });

    return this.isFindable && !foundCharacters.length
      ? this.storage
      : foundCharacters;
  }

  async save(character: Character): Promise<void> {
    this.saveMock(character);
  }

  async update(character: CharacterPatch, username: Username): Promise<void> {
    this.updateMock(character, username);
  }

  async search(id: string): Promise<Character | null> {
    return this.findMock(id);
  }
}
