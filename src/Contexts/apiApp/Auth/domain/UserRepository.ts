import { Nullable } from '../../../shared/domain/Nullable';
import { User } from './User';
import { UserPatch } from './UserPatch';

export interface UserRepository {
  save(user: User): Promise<void>;

  update(user: UserPatch): Promise<void>;

  search(email: string): Promise<Nullable<User>>;
}
