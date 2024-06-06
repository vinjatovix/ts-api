import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../shared/domain/Nullable';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo/MongoRepository';
import { User, UserRepository, Username } from '../../domain';
import { UserPatch } from '../../domain/UserPatch';
import { MetadataType } from '../../../../shared/application/MetadataType';

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

  private async createUniqueIndex(): Promise<void> {
    const collection = await this.collection();
    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ username: 1 }, { unique: true });
  }
}
