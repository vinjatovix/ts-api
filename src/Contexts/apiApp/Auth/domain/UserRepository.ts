import { Nullable } from '../../../shared/domain/Nullable';
import { User } from './User';
import { UserPatch } from './UserPatch';
import { Username } from './Username';

export interface UserRepository {
  save(user: User): Promise<void>;

  update(user: UserPatch, username: Username): Promise<void>;

  search(email: string): Promise<Nullable<User>>;
}
