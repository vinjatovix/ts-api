import { UserRoles } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { random } from '../../../fixtures/shared';
import { UserRolesMother } from './mothers';

describe('UserRoles', () => {
  it('should create a valid user roles', () => {
    const userRoles = UserRolesMother.random();
    expect(userRoles).toBeInstanceOf(UserRoles);
  });

  it('should throw an error if user roles are invalid', () => {
    const roles = [random.word()];
    expect(() => UserRolesMother.create(roles)).toThrow(
      `<UserRoles> does not allow the value <${roles}>`
    );
  });
});
