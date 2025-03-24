import { AuthorName } from '../AuthorName';
import { AuthorProps } from './AuthorProps';

export interface AuthorPatchProps extends Omit<AuthorProps, 'metadata'> {
  name: AuthorName;
}
