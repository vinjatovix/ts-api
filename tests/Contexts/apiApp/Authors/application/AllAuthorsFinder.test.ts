import { AllAuthorsFinder } from '../../../../../src/Contexts/apiApp/Authors/application';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';

describe('AllAuthorsFinder', () => {
  let repository: AuthorRepositoryMock;
  let finder: AllAuthorsFinder;
  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    finder = new AllAuthorsFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all authors', async () => {
    await finder.run();

    repository.assertFindAllHasBeenCalled();
  });
});
