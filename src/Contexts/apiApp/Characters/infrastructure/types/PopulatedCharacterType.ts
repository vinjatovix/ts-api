import { PopulatedBookType } from '../../../Books/infrastructure/types';
import { CharacterType } from './CharacterType';

export type PopulatedCharacterType = CharacterType & {
  books: PopulatedBookType[];
};
