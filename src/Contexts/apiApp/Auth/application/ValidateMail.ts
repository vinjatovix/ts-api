import { EncrypterTool } from '../../../shared/plugins/EncrypterTool';
import { UserRepository } from '../domain';
import { UserPatch } from '../domain/UserPatch';
import { buildLogger } from '../../../shared/plugins/logger.plugin';
import { Nullable } from '../../../shared/domain/Nullable';
import { AuthError } from '../../../shared/domain/errors/AuthError';

const logger = buildLogger('validateMail');

export class ValidateMail {
  private readonly repository: UserRepository;
  private readonly encrypter: EncrypterTool;

  constructor(repository: UserRepository, encrypter: EncrypterTool) {
    this.repository = repository;
    this.encrypter = encrypter;
  }

  async run({ token }: { token: string }): Promise<Nullable<string>> {
    const validToken = await this.encrypter.verifyToken(token);
    if (!validToken) {
      throw new AuthError('Invalid token');
    }
    const { email } = validToken as unknown as { email: string };

    const storedUser = await this.repository.search(email);
    if (!storedUser) {
      throw new AuthError('Invalid token');
    }
    const userToPatch = UserPatch.fromPrimitives({
      id: storedUser.id.value,
      emailValidated: true
    });

    await this.repository.update(userToPatch);
    logger.info(`User <${storedUser.username.value}> validated email`);

    return this.encrypter.refreshToken(token);
  }
}
