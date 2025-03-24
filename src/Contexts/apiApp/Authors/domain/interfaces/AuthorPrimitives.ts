import { MetadataType } from '../../../../shared/infrastructure/persistence/mongo/types';

export interface AuthorPrimitives {
  id: string;
  name?: string;
  metadata: MetadataType;
}
