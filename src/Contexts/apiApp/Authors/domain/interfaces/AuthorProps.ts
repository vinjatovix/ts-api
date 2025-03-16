import { Nullable } from '../../../../shared/domain/types';
import { Uuid, Metadata } from '../../../../shared/domain/valueObject';
import { AuthorName } from '../AuthorName';

export interface AuthorProps {
  id: Uuid;
  name: Nullable<AuthorName>;
  metadata: Metadata;
}
