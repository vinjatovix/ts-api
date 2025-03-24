import { Nullable } from '../../../../shared/domain/types';
import { Metadata, Uuid } from '../../../../shared/domain/valueObject';
import { BookPages } from '../BookPages';
import { BookReleaseDate } from '../BookReleaseDate';
import { BookTitle } from '../BookTitle';
import { Isbn } from '../ISBN';

export interface BookProps {
  id: Uuid;
  title: Nullable<BookTitle>;
  author: Nullable<Uuid>;
  isbn: Nullable<Isbn>;
  releaseDate: Nullable<BookReleaseDate>;
  pages: Nullable<BookPages>;
  metadata: Metadata;
}
