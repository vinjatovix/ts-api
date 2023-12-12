import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../shared/domain/Nullable';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo/MongoRepository';
import { User, UserRepository } from '../../domain';
import { UserPatch } from '../../domain/UserPatch';

export interface AuthDocument {
  _id: string;
  email: string;
  username: string;
  password: string;
  emailValidated: boolean;
  roles: string[];
}

export class MongoAuthRepository
  extends MongoRepository<User | UserPatch>
  implements UserRepository
{
  constructor(client: Promise<MongoClient>) {
    super(client);
    this.createUniqueIndex();
  }
  protected collectionName(): string {
    return 'users';
  }

  async save(user: User): Promise<void> {
    return this.persist(user.id.value, user);
  }

  async update(user: UserPatch): Promise<void> {
    return this.patch(user);
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
          roles: document.roles
        })
      : null;
  }

  private async createUniqueIndex(): Promise<void> {
    const collection = await this.collection();
    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ username: 1 }, { unique: true });
  }
}
