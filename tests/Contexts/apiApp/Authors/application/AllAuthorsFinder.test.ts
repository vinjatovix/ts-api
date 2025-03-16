import { AllAuthorsFinder } from '../../../../../src/Contexts/apiApp/Authors/application';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';

describe('AllAuthorsFinder', () => {
  let repository: AuthorRepositoryMock;
  let service: AllAuthorsFinder;
  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    service = new AllAuthorsFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all authors', async () => {
    await service.run();

    repository.assertFindAllHasBeenCalled();
  });
});
