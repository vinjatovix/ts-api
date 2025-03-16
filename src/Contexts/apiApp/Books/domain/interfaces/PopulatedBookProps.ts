import { Author } from '../../../Authors/domain';
import { BookBaseProps } from './BookBaseProps';

export interface PopulatedBookProps extends BookBaseProps {
  author: Author;
}
