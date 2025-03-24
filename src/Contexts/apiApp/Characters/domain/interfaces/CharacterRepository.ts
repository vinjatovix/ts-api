import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { CharacterByQuery } from '../../application';
import { Character } from '../Character';
import { PopulatedCharacter } from '../PopulatedCharacter';

export interface CharacterRepository {
  save(character: Character): Promise<void>;

  findByQuery(
    query: CharacterByQuery
  ): Promise<Character[] | PopulatedCharacter[]>;

  findAll(
    options?: Partial<RequestOptions>
  ): Promise<Character[] | PopulatedCharacter[]>;

  search(
    id: string,
    options?: Partial<RequestOptions>
  ): Promise<Partial<Character | PopulatedCharacter> | null>;
}
