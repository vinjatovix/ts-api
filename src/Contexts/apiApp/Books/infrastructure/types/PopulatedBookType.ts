import { Entity } from '../../../../shared/infrastructure/persistence/mongo/types';
import { BookType } from './BookType';

export type PopulatedBookType = BookType & {
  author: Entity & {
    name: string;
  };
};
