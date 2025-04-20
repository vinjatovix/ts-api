import { UserPatcher } from '../../../../../src/Contexts/apiApp/Auth/application/UserPatcher';
import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import {
  StringValueObject,
  Uuid
} from '../../../../../src/Contexts/shared/domain/valueObject';
import { random } from '../../../fixtures/shared';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { EmailMother } from '../../../shared/domain/mothers';
import { CryptAdapterMock } from '../__mocks__/CryptAdapterMock';
import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock';

const CURRENT_USER = {
  id: UuidMother.random().value,
  username: new Username(
    random.word({ min: Username.MIN_LENGTH, max: Username.MAX_LENGTH })
  ).value,
  email: EmailMother.random().value
};

const PAYLOAD = {
  password: 'Sup3rSecretPassword%',
  repeatPassword: 'Sup3rSecretPassword%',
  oldPassword: 'OldSup3rSecretPassword.'
};

describe('UserPatcher', () => {
  let encrypter: CryptAdapterMock;
  let repository: UserRepositoryMock;
  let userPatcher: UserPatcher;

  beforeEach(() => {
    encrypter = new CryptAdapterMock({ login: true });
    repository = new UserRepositoryMock({ find: true });
    userPatcher = new UserPatcher(repository, encrypter);
  });

  it('should throw an error when the user does not exist', async () => {
    repository = new UserRepositoryMock();
    userPatcher = new UserPatcher(repository, encrypter);

    expect(async () => {
      await userPatcher.run(PAYLOAD, CURRENT_USER);
    }).rejects.toThrow(expect.objectContaining({ name: 'NotFoundError' }));
  });

  it('should throw an error when the password is invalid', async () => {
    encrypter = new CryptAdapterMock({ login: false });
    userPatcher = new UserPatcher(repository, encrypter);

    expect(async () => {
      await userPatcher.run(PAYLOAD, CURRENT_USER);
    }).rejects.toThrow(
      expect.objectContaining({
        name: 'AuthError'
      })
    );
  });

  it('should throw an error when the password does not match', async () => {
    const request = {
      ...PAYLOAD,
      repeatPassword: 'differentPassword'
    };

    expect(async () => {
      await userPatcher.run(request, CURRENT_USER);
    }).rejects.toThrow(
      expect.objectContaining({
        name: 'AuthError'
      })
    );
  });

  it('should throw an error when the password is the same as the old one', async () => {
    const request = {
      ...PAYLOAD,
      password: PAYLOAD.oldPassword
    };

    expect(async () => {
      await userPatcher.run(request, CURRENT_USER);
    }).rejects.toThrow(
      expect.objectContaining({
        name: 'AuthError'
      })
    );
  });

  it('should patch a valid user', async () => {
    expect(await userPatcher.run(PAYLOAD, CURRENT_USER)).toBeUndefined();

    repository.assertUpdateHasBeenCalledWith(
      expect.objectContaining({
        id: new Uuid(CURRENT_USER.id),
        password: expect.any(StringValueObject)
      })
    );
  });
});
