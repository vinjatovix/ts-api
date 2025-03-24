import { Entity } from '../../../../shared/infrastructure/persistence/mongo/types';
import {
  BookType,
  PopulatedBookType
} from '../../../Books/infrastructure/types';

export type CharacterType = Entity & {
  name: string;
  book: string | Partial<BookType | PopulatedBookType>;
};
