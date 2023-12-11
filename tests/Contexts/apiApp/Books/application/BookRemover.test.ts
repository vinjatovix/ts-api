import { BookRemover } from '../../../../../src/Contexts/apiApp/Books/application/BookRemover';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';
import { BookIdMother } from '../domain/mothers/BookIdMother';
import { RequestBookByIdMother } from './mothers/RequestBookByIdMother';

describe('BookRemover', () => {
  let repository: BookRepositoryMock;
  let remover: BookRemover;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    remover = new BookRemover(repository);
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
