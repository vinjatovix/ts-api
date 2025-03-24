import { Entity } from '../../../../shared/infrastructure/persistence/mongo/types';

export type AuthorType = Entity & {
  name: string;
};
