import { AuthorPatcher } from '../../../../../src/Contexts/apiApp/Authors/application';
import { NotFoundError } from '../../../../../src/Contexts/shared/domain/errors/NotFoundError';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';
import { AuthorMother } from '../domain/mothers/AuthorMother';
import { AuthorCreatorRequestMother } from './mothers/AuthorCreatorRequestMother';

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
    const author = AuthorMother.from(request);

    await updater.run(request);

    repository.assertUpdateHasBeenCalledWith(author);
  });

  it('should throw an error when the author is not found', async () => {
    const request = AuthorCreatorRequestMother.random();
    request.id = 'not-found';

    await expect(updater.run(request)).rejects.toThrow(NotFoundError);
  });
});
