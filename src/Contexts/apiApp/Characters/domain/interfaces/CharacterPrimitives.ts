import { MetadataType } from '../../../../shared/infrastructure/persistence/mongo/types';
import { BookPrimitives } from '../../../Books/domain/interfaces';

export interface CharacterPrimitives extends Record<string, unknown> {
  id: string;
  name?: string;
  book?: string | BookPrimitives;
  metadata: MetadataType;
}
