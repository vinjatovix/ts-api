import { RegisterUser } from '../../../../../src/Contexts/apiApp/Auth/application';
import {
  Email,
  UserRoles,
  Username
} from '../../../../../src/Contexts/apiApp/Auth/domain';
import { StringValueObject } from '../../../../../src/Contexts/shared/domain/value-object/StringValueObject';
import { CryptAdapterMock } from '../__mocks__/CryptAdapterMock';
import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock';
import { RegisterUserRequestMother } from './mothers/RegisterUserRequestMother';

describe('RegisterUser', () => {
  let encrypter: CryptAdapterMock;
  let repository: UserRepositoryMock;
  let registerUser: RegisterUser;

  beforeEach(() => {
    encrypter = new CryptAdapterMock({ login: false });
    repository = new UserRepositoryMock({ exists: false });
    registerUser = new RegisterUser(repository, encrypter);
  });

  it('should register a valid user', async () => {
    const request = RegisterUserRequestMother.random();

    await registerUser.run(request);

    repository.assertSearchHasBeenCalledWith(request.email);
    repository.assertSaveHasBeenCalledWith(
      expect.objectContaining({
        email: expect.any(Email),
        username: expect.any(Username),
        password: expect.any(StringValueObject),
        emailValidated: expect.any(Boolean),
        roles: expect.any(UserRoles)
      })
    );
  });

  it('should throw an error when the user already exists', async () => {
    const request = RegisterUserRequestMother.random();
    repository = new UserRepositoryMock({ exists: true });
    registerUser = new RegisterUser(repository, encrypter);

    expect(async () => {
      await registerUser.run(request);
    }).rejects.toThrowError(`User <${request.email}> already exists`);
  });
});
