import { BookPatcher } from '../../../../../src/Contexts/apiApp/Books/application/BookPatcher';
import { BookPatch } from '../../../../../src/Contexts/apiApp/Books/domain';
import { UserMother } from '../../Auth/domain/mothers';
import { AuthorRepositoryMock } from '../../Authors/__mocks__/AuthorRepositoryMock';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';
import { BookCreatorRequestMother } from './mothers/BookCreatorRequestMother';

const username = UserMother.random().username;

describe('BookPatcher', () => {
  let repository: BookRepositoryMock;
  let authorRepository: AuthorRepositoryMock;
  let updater: BookPatcher;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    authorRepository = new AuthorRepositoryMock();
    updater = new BookPatcher(repository, authorRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a valid book', async () => {
    const request = BookCreatorRequestMother.random();
    const bookPatch = BookPatch.fromPrimitives(request);

    await updater.run(request, username.value);

    repository.assertUpdateHasBeenCalledWith(
      expect.objectContaining(bookPatch),
      username
    );
  });

  it('should throw an error when the author is not found', async () => {
    const request = BookCreatorRequestMother.random();
    request.author = 'not-found';

    await expect(updater.run(request, username.value)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });
});
