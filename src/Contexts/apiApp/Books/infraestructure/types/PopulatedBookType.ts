import { Entity } from '../../../../shared/infrastructure/persistence/mongo';
import { BookType } from './BookType';

export type PopulatedBookType = BookType & {
  author: Entity & {
    name: string;
  };
};
