import { Nullable } from '../../../../shared/domain/types';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo';
import { MetadataType } from '../../../../shared/infrastructure/persistence/mongo/types';
import { User, UserPatch, Username } from '../../domain';
import { UserRepository } from '../../domain/interfaces';

export interface AuthDocument {
  _id: string;
  email: string;
  username: string;
  password: string;
  emailValidated: boolean;
  roles: string[];
  metadata: MetadataType;
}

export class MongoAuthRepository
  extends MongoRepository<User | UserPatch>
  implements UserRepository
{
  protected collectionName(): string {
    return 'users';
  }

  async save(user: User): Promise<void> {
    return this.persist(user.id.value, user);
  }

  async update(user: UserPatch, username: Username): Promise<void> {
    return this.persist(user.id.value, user, username);
  }

  async search(email: string): Promise<Nullable<User>> {
    const collection = await this.collection();
    const document = await collection.findOne<AuthDocument>({ email });

    return document
      ? User.fromPrimitives({
          id: document._id,
          email: document.email,
          username: document.username,
          password: document.password,
          emailValidated: document.emailValidated,
          roles: document.roles,
          metadata: document.metadata
        })
      : null;
  }
}
