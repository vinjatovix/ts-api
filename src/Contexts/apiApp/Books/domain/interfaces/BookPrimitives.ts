import { MetadataType } from '../../../../shared/application/MetadataType';
import { AuthorPrimitives } from '../../../Authors/application/interfaces';

export interface BookPrimitives extends Record<string, unknown> {
  id: string;
  title?: string;
  author?: string | AuthorPrimitives;
  isbn?: string;
  releaseDate?: string;
  pages?: number;
  metadata: MetadataType;
}
