import { Uuid } from '../../../../shared/domain/valueObject';
import { BookBaseProps } from './BookBaseProps';

export interface BookPatchProps extends Omit<BookBaseProps, 'metadata'> {
  author?: Uuid;
}
