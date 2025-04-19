import { createError } from '../../../shared/domain/errors';
import { buildLogger, EncrypterTool } from '../../../shared/plugins';
import { Username, UserPatch } from '../domain';
import { UserRepository } from '../domain/interfaces';
import { UserPatcherRequest } from './interfaces/UserPatcherRequest';

const logger = buildLogger('userPatcher');

export class UserPatcher {
  constructor(
    private readonly repository: UserRepository,
    private readonly encrypter: EncrypterTool
  ) {}

  async run(
    { password, repeatPassword, oldPassword }: UserPatcherRequest,
    user: { username: string; id: string; email: string }
  ): Promise<void> {
    await this.validatePatch(
      {
        password,
        repeatPassword,
        oldPassword
      },
      user
    );
    const userPatch = UserPatch.fromPrimitives({
      id: user.id,
      ...(password && { password })
    });

    await this.repository.update(userPatch, new Username(user.username));
    logger.info(`Updated User: <${userPatch.id}> by <${user.username}>`);
  }

  private async validatePatch(
    request: UserPatcherRequest,
    user: {
      username: string;
      id: string;
      email: string;
    }
  ): Promise<void> {
    const storedUser = await this.repository.search(user.email);

    if (!storedUser) {
      throw createError.notFound(`User <${user.id}>`);
    }

    const success = this.encrypter.compare(
      request.oldPassword,
      storedUser.password.value
    );
    if (!success) {
      throw createError.auth('Invalid credentials');
    }

    if (request.password !== request.repeatPassword) {
      throw createError.auth('Passwords do not match');
    }
    if (request.password === request.oldPassword) {
      throw createError.auth(
        'New password must be different from old password'
      );
    }
  }
}
