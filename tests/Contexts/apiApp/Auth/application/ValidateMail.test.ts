import { ValidateMail } from '../../../../../src/Contexts/apiApp/Auth/application';
import { UserPatch } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { random } from '../../../fixtures/shared';
import { CryptAdapterMock } from '../__mocks__/CryptAdapterMock';
import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock';

describe('ValidateMail', () => {
  let encrypter: CryptAdapterMock;
  let repository: UserRepositoryMock;
  let service: ValidateMail;

  beforeEach(() => {
    encrypter = new CryptAdapterMock({ token: true });
    repository = new UserRepositoryMock({ exists: true });
    service = new ValidateMail(repository, encrypter);
  });

  it('should validate the user', async () => {
    const token = random.word({ min: 6, max: 255 });

    await service.run({ token });

    encrypter.assertVerifyTokenHasBeenCalledWith(token);
    repository.assertSearchHasBeenCalledWith(expect.any(String));
    repository.assertUpdateHasBeenCalledWith(expect.any(UserPatch));
    encrypter.assertRefreshTokenHasBeenCalledWith(token);
  });

  it('should throw an error if the token is invalid', async () => {
    encrypter = new CryptAdapterMock({ token: false });
    service = new ValidateMail(repository, encrypter);
    const token = random.word({ min: 6, max: 255 });

    await expect(service.run({ token })).rejects.toThrow({
      name: 'AuthError',
      message: 'Invalid token'
    });
  });

  it('should throw an error if the user is not found', async () => {
    repository = new UserRepositoryMock({ exists: false });
    service = new ValidateMail(repository, encrypter);
    const token = random.word({ min: 6, max: 255 });

    await expect(service.run({ token })).rejects.toThrow({
      name: 'AuthError',
      message: 'Invalid token'
    });
  });
});
