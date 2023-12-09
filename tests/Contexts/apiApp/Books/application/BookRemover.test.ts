import { BookRemover } from '../../../../../src/Contexts/apiApp/Books/application/BookRemover';
import { LogRepositoryMock } from '../../../shared/__mocks__/LogRepositoryMock';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';
import { BookIdMother } from '../domain/BookIdMother';
import { RequestBookByIdMother } from './RequestBookByIdMother';

describe('BookRemover', () => {
  let repository: BookRepositoryMock;
  let remover: BookRemover;
  let logRepository: LogRepositoryMock;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    logRepository = new LogRepositoryMock();
    remover = new BookRemover(repository, logRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove a book', async () => {
    const bookId = BookIdMother.random();
    const request = RequestBookByIdMother.create(bookId);

    await remover.run(request);

    repository.assertRemoveHasBeenCalledWith(bookId.value);
  });

  it('should not throw an error when the book is not found', async () => {
    const request = RequestBookByIdMother.inexistentId();

    await expect(remover.run(request)).resolves.toBeUndefined();
  });
});
