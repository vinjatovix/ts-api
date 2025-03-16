import { Nullable } from '../../../../shared/domain/types';
import { Uuid, Metadata } from '../../../../shared/domain/valueObject';
import { BookPages } from '../BookPages';
import { BookReleaseDate } from '../BookReleaseDate';
import { BookTitle } from '../BookTitle';
import { Isbn } from '../ISBN';

export interface BookBaseProps {
  id: Uuid;
  title?: Nullable<BookTitle>;
  releaseDate?: Nullable<BookReleaseDate>;
  pages?: Nullable<BookPages>;
  isbn?: Nullable<Isbn>;
  metadata: Metadata;
}
