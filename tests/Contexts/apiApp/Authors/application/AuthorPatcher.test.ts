import { AuthorPatcher } from '../../../../../src/Contexts/apiApp/Authors/application';
import { AuthorPatch } from '../../../../../src/Contexts/apiApp/Authors/domain';
import { UserMother } from '../../Auth/domain/mothers';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';
import { AuthorCreatorRequestMother } from './mothers/AuthorCreatorRequestMother';

const username = UserMother.random().username;
const request = AuthorCreatorRequestMother.random();

describe('AuthorPatcher', () => {
  let repository: AuthorRepositoryMock;
  let updater: AuthorPatcher;

  beforeEach(() => {
    repository = new AuthorRepositoryMock({ find: true });
    updater = new AuthorPatcher(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a valid author', async () => {
    const author = AuthorPatch.fromPrimitives(request);

    await updater.run(request, username.value);

    repository.assertUpdateHasBeenCalledWith(
      expect.objectContaining(author),
      username
    );
  });

  it('should throw an error when the author is not found', async () => {
    repository.setFindable(false);
    await expect(updater.run(request, username.value)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });
});
