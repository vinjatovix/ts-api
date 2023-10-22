import { BookFinder } from '../../../../../src/Contexts/apiApp/Books/application/BookFinder';
import { NotFoundError } from '../../../../../src/Contexts/shared/domain/value-object/NotFoundError';
import { RequestBookByIdMother } from './RequestBookByIdMother';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';
import { BookIdMother } from '../domain/BookIdMother';

describe('BookFinder', () => {
  let repository: BookRepositoryMock;
  let finder: BookFinder;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    finder = new BookFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a book', async () => {
    const bookId = BookIdMother.random();
    const request = RequestBookByIdMother.create(bookId);

    await finder.run(request);

    repository.assertSearchHasBeenCalledWith(bookId.value);
  });

  it('should throw an error when the book is not found', async () => {
    const request = RequestBookByIdMother.inexistentId();

    await expect(finder.run(request)).rejects.toThrowError(NotFoundError);
  });
});
