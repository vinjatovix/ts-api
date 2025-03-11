import { MetadataType } from '../../../../shared/application/MetadataType';

export interface AuthorPrimitives {
  id: string;
  name?: string;
  metadata: MetadataType;
}
