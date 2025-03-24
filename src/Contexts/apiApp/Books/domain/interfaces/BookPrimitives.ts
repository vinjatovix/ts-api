import { MetadataType } from '../../../../shared/infrastructure/persistence/mongo/types';
import { AuthorPrimitives } from '../../../Authors/domain/interfaces';

export interface BookPrimitives extends Record<string, unknown> {
  id: string;
  title?: string;
  author?: string | AuthorPrimitives;
  isbn?: string;
  releaseDate?: string;
  pages?: number;
  metadata: MetadataType;
}
