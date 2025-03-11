import { Entity } from '../../../../shared/infrastructure/persistence/mongo/Entity';
import {
  BookType,
  PopulatedBookType
} from '../../../Books/infraestructure/types';

export type CharacterType = Entity & {
  name: string;
  book: string | Partial<BookType | PopulatedBookType>;
};
