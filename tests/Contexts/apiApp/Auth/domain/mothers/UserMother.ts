import { RegisterUserRequest } from '../../../../../../src/Contexts/apiApp/Auth/application/interfaces';
import {
  User,
  UserRoles,
  Username,
  UserPatch
} from '../../../../../../src/Contexts/apiApp/Auth/domain';
import {
  Email,
  Metadata,
  StringValueObject,
  Uuid
} from '../../../../../../src/Contexts/shared/domain/valueObject';
import { random } from '../../../../fixtures/shared';
import { EmailMother } from '../../../../shared/domain/mothers';
import { UserRolesMother } from './UserRolesMother';

export class UserMother {
  static create({
    id,
    email,
    username,
    password,
    emailValidated,
    roles,
    metadata
  }: {
    id?: Uuid;
    email?: Email;
    username?: Username;
    password?: StringValueObject;
    emailValidated?: boolean;
    roles?: UserRoles;
    metadata?: Metadata;
  } = {}): User {
    const user = username ?? new Username(random.word({ min: 4, max: 20 }));
    return new User({
      id: id ?? Uuid.random(),
      email: email ?? EmailMother.random(),
      username: user,
      password: password ?? new StringValueObject(random.word()),
      emailValidated: emailValidated ?? random.boolean(),
      roles:
        roles ??
        UserRolesMother.create([`${random.arrayElement(['admin', 'user'])}`]),
      metadata:
        metadata ??
        new Metadata({
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: user.value,
          updatedBy: user.value
        })
    });
  }

  static from(command: RegisterUserRequest): User {
    return this.create({
      email: new Email(command.email),
      username: new Username(command.username),
      password: new StringValueObject(command.password)
    });
  }

  static random(): User {
    return this.create();
  }

  static randomPatch(id: string): UserPatch {
    return new UserPatch({
      id: new Uuid(id),
      password: new StringValueObject(random.word()),
      emailValidated: random.boolean(),
      roles: UserRolesMother.random()
    });
  }
}
