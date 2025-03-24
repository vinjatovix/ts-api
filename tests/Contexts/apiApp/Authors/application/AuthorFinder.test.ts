import { AuthorFinder } from '../../../../../src/Contexts/apiApp/Authors/application';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';
import { UuidMother } from '../../../fixtures/shared/domain/mothers/UuidMother';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';

describe('AuthorFinder', () => {
  let repository: AuthorRepositoryMock;
  let finder: AuthorFinder;

  beforeEach(() => {
    repository = new AuthorRepositoryMock({ find: true });
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
    repository.setFindable(false);
    const request = RequestByIdMother.create(UuidMother.random());

    await expect(finder.run(request)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });
});
