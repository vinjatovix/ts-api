import { AllBooksFinder } from '../../../../../src/Contexts/apiApp/Books/application';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';

describe('AllBooksFinder', () => {
  let repository: BookRepositoryMock;
  let service: AllBooksFinder;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    service = new AllBooksFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all books', async () => {
    await service.run();

    repository.assertFindAllHasBeenCalled();
  });

  it('should find all books with options', async () => {
    const options = { include: ['author'] };

    await service.run(options);

    repository.assertFindAllHasBeenCalledWith(options);
  });
});
