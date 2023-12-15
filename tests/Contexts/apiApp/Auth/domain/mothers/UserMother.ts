import { RegisterUserRequest } from '../../../../../../src/Contexts/apiApp/Auth/application/RegisterUserRequest';
import {
  User,
  Email,
  UserRoles,
  Username,
  UserPatch
} from '../../../../../../src/Contexts/apiApp/Auth/domain';
import { StringValueObject } from '../../../../../../src/Contexts/shared/domain/value-object/StringValueObject';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/value-object/Uuid';
import { random } from '../../../../fixtures/shared';
import { EmailMother } from '../../../../shared/domain/mothers/EmailMother';
import { UserRolesMother } from './UserRolesMother';

export class UserMother {
  static create({
    id,
    email,
    username,
    password,
    emailValidated,
    roles
  }: {
    id?: Uuid;
    email?: Email;
    username?: Username;
    password?: StringValueObject;
    emailValidated?: boolean;
    roles?: UserRoles;
  } = {}): User {
    return new User({
      id: id ?? Uuid.random(),
      email: email ?? EmailMother.random(),
      username: username ?? new Username(random.word({ min: 4, max: 20 })),
      password: password ?? new StringValueObject(random.word()),
      emailValidated: emailValidated ?? random.boolean(),
      roles:
        roles ??
        UserRolesMother.create([`${random.arrayElement(['admin', 'user'])}`])
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
