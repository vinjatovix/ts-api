import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { StringValueObject } from '../../../shared/domain/value-object/StringValueObject';
import { Uuid } from '../../../shared/domain/value-object/Uuid';
import { UserRoles } from './UserRoles';

export class UserPatch extends AggregateRoot {
  readonly id: Uuid;
  readonly password?: StringValueObject;
  readonly emailValidated?: boolean;
  readonly roles?: UserRoles;

  constructor({
    id,
    password,
    emailValidated,
    roles
  }: {
    id: Uuid;
    password?: StringValueObject;
    emailValidated?: boolean;
    roles?: UserRoles;
  }) {
    super();
    this.id = id;
    password && (this.password = password);
    emailValidated && (this.emailValidated = emailValidated);
    roles && (this.roles = roles);
  }

  toPrimitives() {
    return {
      id: this.id.value,
      ...(this.password?.value && { password: this.password.value }),
      ...(this.emailValidated && { emailValidated: this.emailValidated }),
      ...(this.roles?.value && { roles: this.roles.value })
    };
  }

  static fromPrimitives({
    id,
    password,
    emailValidated,
    roles
  }: {
    id: string;
    password?: string;
    emailValidated?: boolean;
    roles?: string[];
  }) {
    return new UserPatch({
      id: new Uuid(id),
      ...(password && { password: new StringValueObject(password) }),
      ...(emailValidated && { emailValidated }),
      ...(roles && { roles: new UserRoles(roles) })
    });
  }
}
