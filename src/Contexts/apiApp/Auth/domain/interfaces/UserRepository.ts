import { Nullable } from '../../../../shared/domain/types';
import { User } from '../User';
import { Username } from '../Username';
import { UserPatch } from '../UserPatch';

export interface UserRepository {
  save(user: User): Promise<void>;

  update(user: UserPatch, username: Username): Promise<void>;

  search(email: string): Promise<Nullable<User>>;
}
