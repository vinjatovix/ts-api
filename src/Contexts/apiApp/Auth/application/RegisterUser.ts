import { createError } from '../../../shared/domain/errors';
import {
  Email,
  Metadata,
  StringValueObject,
  Uuid
} from '../../../shared/domain/valueObject';
import { EncrypterTool, buildLogger } from '../../../shared/plugins';
import { User, Username, UserRoles } from '../domain';
import { UserRepository } from '../domain/interfaces';
import { RegisterUserRequest } from './interfaces';

const logger = buildLogger('registerUser');

export class RegisterUser {
  private readonly repository: UserRepository;
  private readonly encrypter: EncrypterTool;

  constructor(repository: UserRepository, encrypter: EncrypterTool) {
    this.repository = repository;
    this.encrypter = encrypter;
  }

  async run({ password, username, email }: RegisterUserRequest): Promise<void> {
    const storedUser = await this.repository.search(email);
    if (storedUser) {
      throw createError.invalidArgument(`User <${email}> already exists`);
    }

    const encryptedPassword = this.encrypter.hash(password);
    const date = new Date();

    const user = new User({
      id: Uuid.random(),
      email: new Email(email),
      username: new Username(username),
      password: new StringValueObject(encryptedPassword),
      emailValidated: false,
      roles: new UserRoles(['user']),
      metadata: new Metadata({
        createdAt: date,
        createdBy: username,
        updatedAt: date,
        updatedBy: username
      })
    });

    await this.repository.save(user);
    logger.info(`User <${user.username.value}> registered`);
  }
}
