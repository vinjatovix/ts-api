import {
  User,
  UserPatch
} from '../../../../../src/Contexts/apiApp/Auth/domain';
import { UserRepository } from '../../../../../src/Contexts/apiApp/Auth/domain/interfaces';
import { Nullable } from '../../../../../src/Contexts/shared/domain/types';
import {
  Email,
  StringValueObject,
  Uuid
} from '../../../../../src/Contexts/shared/domain/valueObject';
import { UserMother } from '../domain/mothers';

export class UserRepositoryMock implements UserRepository {
  private readonly saveMock = jest.fn();
  private readonly updateMock = jest.fn();
  private readonly findMock = jest.fn();
  private readonly findByQueryMock = jest.fn();
  private readonly password = new StringValueObject(
    '$2a$12$mZgfH4D7z4dZcZHDKyogqOOnEWS6XHLdczPJktzD88djpvlr3Bq1C'
  );
  private isFindable: boolean;
  private readonly storage: User[] = [];

  constructor({ find }: { find: boolean } = { find: false }) {
    this.isFindable = find;
    this.setupMocks();
  }

  private setupMocks(): void {
    this.findMock.mockImplementation((email: string) => {
      if (!this.isFindable) {
        return null;
      }
      return UserMother.create({
        email: new Email(email),
        password: this.password
      });
    });

    this.findByQueryMock.mockImplementation(
      ({ id, username }: { id: string; username: string }) => {
        if (!this.isFindable) {
          return this.storage.filter((user) => {
            if (id) {
              return user.id.value === id;
            }
            if (username) {
              return user.username.value === username;
            }
            return true;
          });
        }

        const { password: _password, ...user } = UserMother.create({
          id: new Uuid(id)
        });
        return [user];
      }
    );
  }

  async save(user: User): Promise<void> {
    this.saveMock(user);
  }

  assertSaveHasBeenCalledWith(expected: User): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  async update(user: UserPatch): Promise<void> {
    this.updateMock(user);
  }

  assertUpdateHasBeenCalledWith(expected: UserPatch): void {
    expect(this.updateMock).toHaveBeenCalledWith(expected);
  }

  async search(email: string): Promise<Nullable<User>> {
    return this.findMock(email);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.findMock).toHaveBeenCalledWith(expected);
  }

  async findByQuery(query: {
    id?: string;
    username?: string;
  }): Promise<Partial<User>[]> {
    return this.findByQueryMock(query);
  }

  assertFindByQueryHasBeenCalledWith(expected: {
    id?: string;
    username?: string;
  }): void {
    expect(this.findByQueryMock).toHaveBeenCalledWith(expected);
  }

  setIsFindable(exists: boolean): void {
    this.isFindable = exists;
  }

  addToStorage(user: User): void {
    this.storage.push(user);
  }
}
