import { AuthorPatcher } from '../../../../../src/Contexts/apiApp/Authors/application';
import { AuthorPatch } from '../../../../../src/Contexts/apiApp/Authors/domain';
import { NotFoundError } from '../../../../../src/Contexts/shared/domain/errors/NotFoundError';
import { UserMother } from '../../Auth/domain/mothers';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';
import { AuthorCreatorRequestMother } from './mothers/AuthorCreatorRequestMother';

const username = UserMother.random().username;

describe('AuthorPatcher', () => {
  let repository: AuthorRepositoryMock;
  let updater: AuthorPatcher;

  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    updater = new AuthorPatcher(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a valid author', async () => {
    const request = AuthorCreatorRequestMother.random();
    const author = AuthorPatch.fromPrimitives(request);

    await updater.run(request, username.value);

    repository.assertUpdateHasBeenCalledWith(
      expect.objectContaining(author),
      username
    );
  });

  it('should throw an error when the author is not found', async () => {
    const request = AuthorCreatorRequestMother.random();
    request.id = 'not-found';

    await expect(updater.run(request, username.value)).rejects.toThrow(
      NotFoundError
    );
  });
});
