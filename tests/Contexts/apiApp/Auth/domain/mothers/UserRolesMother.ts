import { UserRoles } from '../../../../../../src/Contexts/apiApp/Auth/domain';
import { random } from '../../../../fixtures/shared';

export class UserRolesMother {
  static create(value: string[]) {
    return new UserRoles(value);
  }

  static random() {
    return this.create([`${random.arrayElement(['admin', 'user'])}`]);
  }
}
