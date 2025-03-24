import { AuthorFinder } from '../../../../../src/Contexts/apiApp/Authors/application';
import { NotFoundError } from '../../../../../src/Contexts/shared/domain/errors/NotFoundError';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';
import { UuidMother } from '../../../fixtures/shared/domain/mothers/UuidMother';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';
import { AuthorCreatorRequestMother } from './mothers/AuthorCreatorRequestMother';

describe('AuthorFinder', () => {
  let repository: AuthorRepositoryMock;
  let finder: AuthorFinder;

  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    finder = new AuthorFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find an author', async () => {
    const request = RequestByIdMother.create(UuidMother.random());

    await finder.run(request);

    repository.assertSearchHasBeenCalledWith(request.id);
  });

  it('should throw an error when the author is not found', async () => {
    const request = AuthorCreatorRequestMother.inexistentId();

    await expect(finder.run(request)).rejects.toThrow(NotFoundError);
  });
});
