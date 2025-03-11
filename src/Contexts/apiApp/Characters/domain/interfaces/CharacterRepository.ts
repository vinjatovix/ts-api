import { CharacterByQuery } from '../../application';
import { Character } from '../Character';

export interface CharacterRepository {
  save(character: Character): Promise<void>;

  findByQuery(query: CharacterByQuery): Promise<Character[]>;
}
