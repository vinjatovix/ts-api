import { createError } from '../../../shared/domain/errors';
import { Nullable } from '../../../shared/domain/types';
import { buildLogger, EncrypterTool } from '../../../shared/plugins';
import { UserPatch } from '../domain';
import { UserRepository } from '../domain/interfaces';

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
      throw createError.auth('Invalid token');
    }
    const { email } = validToken as unknown as { email: string };

    const storedUser = await this.repository.search(email);
    if (!storedUser) {
      throw createError.auth('Invalid token');
    }
    const userToPatch = UserPatch.fromPrimitives({
      id: storedUser.id.value,
      emailValidated: true
    });

    await this.repository.update(userToPatch, storedUser.username);
    logger.info(`User <${storedUser.username.value}> validated email`);

    return this.encrypter.refreshToken(token);
  }
}
