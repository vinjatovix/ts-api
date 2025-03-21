import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { Username } from '../../../Auth/domain';
import { Author } from '../Author';
import { AuthorPatch } from '../AuthorPatch';

export interface AuthorRepository {
  save(author: Author): Promise<void>;

  update(author: AuthorPatch, user: Username): Promise<void>;

  search(authorId: string): Promise<Author | null>;

  findAll(options?: Partial<RequestOptions>): Promise<Author[]>;

  remove(authorId: string): Promise<void>;
}
