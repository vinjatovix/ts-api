import { LoginUser } from '../../../../../src/Contexts/apiApp/Auth/application';
import { CryptAdapterMock } from '../__mocks__/CryptAdapterMock';
import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock';
import { LoginUserRequestMother } from './mothers/LoginUserRequestMother';

describe('LoginUser', () => {
  let encrypter: CryptAdapterMock;
  let repository: UserRepositoryMock;
  let loginUser: LoginUser;

  beforeEach(() => {
    encrypter = new CryptAdapterMock({ login: true });
    repository = new UserRepositoryMock({ exists: true });
    loginUser = new LoginUser(repository, encrypter);
  });

  it('should login a valid user', async () => {
    const request = LoginUserRequestMother.random();

    await loginUser.run(request);

    repository.assertSearchHasBeenCalledWith(request.email);
    encrypter.assertCompareHasBeenCalledWith(
      request.password,
      expect.any(String)
    );
  });

  it('should throw an error when the user does not exist', async () => {
    repository = new UserRepositoryMock({ exists: false });
    loginUser = new LoginUser(repository, encrypter);
    const request = LoginUserRequestMother.random();

    expect(async () => {
      await loginUser.run(request);
    }).rejects.toThrow(`Invalid credentials`);
  });

  it('should throw an error when the password is invalid', async () => {
    encrypter = new CryptAdapterMock({ login: false });
    loginUser = new LoginUser(repository, encrypter);
    const request = LoginUserRequestMother.random();

    expect(async () => {
      await loginUser.run(request);
    }).rejects.toThrow(`Invalid credentials`);
  });
});
