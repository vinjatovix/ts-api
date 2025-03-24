import { AllBooksFinder } from '../../../../../src/Contexts/apiApp/Books/application';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';

describe('AllBooksFinder', () => {
  let repository: BookRepositoryMock;
  let finder: AllBooksFinder;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    finder = new AllBooksFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all books', async () => {
    await finder.run();

    repository.assertSearchAllHasBeenCalled();
  });

  it('should find all books with options', async () => {
    const options = { include: ['author'] };

    await finder.run(options);

    repository.assertSearchAllHasBeenCalledWith(options);
  });
});
