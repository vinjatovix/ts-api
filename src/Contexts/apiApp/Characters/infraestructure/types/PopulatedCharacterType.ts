import { PopulatedBookType } from '../../../Books/infraestructure/types/PopulatedBookType';
import { CharacterType } from './CharacterType';

export type PopulatedCharacterType = CharacterType & {
  books: PopulatedBookType[];
};
