import { BookFinder } from '../../../../../src/Contexts/apiApp/Books/application/BookFinder';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';

const request = {
  id: UuidMother.random().value
};

describe('BookFinder', () => {
  let repository: BookRepositoryMock;
  let finder: BookFinder;

  beforeEach(() => {
    repository = new BookRepositoryMock({ find: true });
    finder = new BookFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a book', async () => {
    await finder.run(request);

    repository.assertSearchHasBeenCalledWith(request.id);
  });

  it('should throw an error when the book is not found', async () => {
    repository.setFindable(false);

    await expect(finder.run(request)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });
});
