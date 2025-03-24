import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { Username } from '../../../Auth/domain/Username';
import { CharacterByQuery } from '../../application';
import { Character } from '../Character';
import { CharacterPatch } from '../CharacterPatch';
import { PopulatedCharacter } from '../PopulatedCharacter';

export interface CharacterRepository {
  save(character: Character): Promise<void>;

  findByQuery(
    query: CharacterByQuery | { _id: { $in: string[] } }
  ): Promise<Character[] | PopulatedCharacter[]>;

  findAll(
    options?: Partial<RequestOptions>
  ): Promise<Character[] | PopulatedCharacter[]>;

  search(
    id: string,
    options?: Partial<RequestOptions>
  ): Promise<Partial<Character | PopulatedCharacter> | null>;

  update(char: CharacterPatch, user: Username): Promise<void>;

  remove(id: string): Promise<void>;
}
