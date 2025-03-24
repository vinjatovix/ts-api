import { Entity } from '../../../../shared/infrastructure/persistence/mongo/types';

export type BookType = Entity & {
  title: string;
  author: string;
  isbn: string;
  releaseDate: Date | string;
  pages: number;
};
