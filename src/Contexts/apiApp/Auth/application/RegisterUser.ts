import { InvalidArgumentError } from '../../../shared/domain/errors/InvalidArgumentError';
import { StringValueObject, Uuid } from '../../../shared/domain/valueObject';
import { EncrypterTool, buildLogger } from '../../../shared/plugins';
import { User, Email, UserRepository, UserRoles, Username } from '../domain';
import { RegisterUserRequest } from './interfaces/RegisterUserRequest';

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
      throw new InvalidArgumentError(`User <${email}> already exists`);
    }

    const encryptedPassword = this.encrypter.hash(password);

    const user = new User({
      id: Uuid.random(),
      email: new Email(email),
      username: new Username(username),
      password: new StringValueObject(encryptedPassword),
      emailValidated: false,
      roles: new UserRoles(['user'])
    });

    await this.repository.save(user);
    logger.info(`User <${user.username.value}> registered`);
  }
}
