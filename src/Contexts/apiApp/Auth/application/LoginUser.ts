import { createError } from '../../../shared/domain/errors';
import { Nullable } from '../../../shared/domain/types';
import { buildLogger, EncrypterTool } from '../../../shared/plugins';
import { UserRepository } from '../domain/interfaces';
import { LoginUserRequest } from './interfaces/';

const logger = buildLogger('loginUser');

export class LoginUser {
  private readonly repository: UserRepository;
  private readonly encrypter: EncrypterTool;

  constructor(repository: UserRepository, encrypter: EncrypterTool) {
    this.repository = repository;
    this.encrypter = encrypter;
  }

  async run({ email, password }: LoginUserRequest): Promise<Nullable<string>> {
    const storedUser = await this.repository.search(email);
    if (!storedUser) {
      throw createError.auth('Invalid credentials');
    }

    const success = await this.encrypter.compare(
      password,
      storedUser.password.value
    );
    if (!success) {
      throw createError.auth('Invalid credentials');
    }

    const token = await this.encrypter.generateToken({
      id: storedUser.id.value,
      email: storedUser.email.value,
      username: storedUser.username.value,
      roles: storedUser.roles.value
    });

    logger.info(`User <${storedUser.username.value}> logged in`);
    return token;
  }
}
