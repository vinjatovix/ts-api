import { InvalidArgumentError } from '../../../shared/domain/errors/InvalidArgumentError';

export class UserRoles {
  private static validRoles = ['admin', 'user'];
  readonly value: string[];

  constructor(value: string[]) {
    this.ensureRoles(value);
    this.value = value;
  }

  private ensureRoles(value: string[]): void {
    value.forEach((role) => {
      if (!UserRoles.validRoles.includes(role)) {
        throw new InvalidArgumentError(
          `<${this.constructor.name}> does not allow the value <${role}>`
        );
      }
    });
  }
}
