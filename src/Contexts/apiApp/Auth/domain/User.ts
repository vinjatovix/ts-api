import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { StringValueObject } from '../../../shared/domain/value-object/StringValueObject';
import { Uuid } from '../../../shared/domain/value-object/Uuid';
import { Email } from '../../../shared/domain/value-object/Email';
import { UserRoles } from './UserRoles';
import { Username } from './Username';

export class User extends AggregateRoot {
  readonly id: Uuid;
  readonly email: Email;
  readonly username: Username;
  readonly password: StringValueObject;
  readonly emailValidated: boolean;
  readonly roles: UserRoles;

  constructor({
    id,
    email,
    username,
    password,
    emailValidated,
    roles
  }: {
    id: Uuid;
    email: Email;
    username: Username;
    password: StringValueObject;
    emailValidated: boolean;
    roles: UserRoles;
  }) {
    super();
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.emailValidated = emailValidated;
    this.roles = roles;
  }

  toPrimitives(): Record<string, unknown> {
    return {
      id: this.id.value,
      email: this.email.value,
      username: this.username.value,
      password: this.password.value,
      emailValidated: this.emailValidated,
      roles: this.roles.value
    };
  }

  static fromPrimitives({
    id,
    email,
    username,
    password,
    emailValidated,
    roles
  }: {
    id: string;
    email: string;
    username: string;
    password: string;
    emailValidated: boolean;
    roles: string[];
  }): User {
    return new User({
      id: new Uuid(id),
      email: new Email(email),
      username: new Username(username),
      password: new StringValueObject(password),
      emailValidated,
      roles: new UserRoles(roles)
    });
  }
}
