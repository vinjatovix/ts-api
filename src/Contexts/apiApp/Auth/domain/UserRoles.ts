import { createError } from '../../../shared/domain/errors';

export class UserRoles {
  private static readonly validRoles = ['admin', 'user'];
  readonly value: string[];

  constructor(value: string[]) {
    this.ensureRoles(value);
    this.value = value;
  }

  private ensureRoles(value: string[]): void {
    value.forEach((role) => {
      if (!UserRoles.validRoles.includes(role)) {
        throw createError.invalidArgument(
          `<${this.constructor.name}> does not allow the value <${role}>`
        );
      }
    });
  }
}
