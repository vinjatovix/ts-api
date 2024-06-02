import { BookPatcher } from '../../../../../src/Contexts/apiApp/Books/application/BookPatcher';
import { NotFoundError } from '../../../../../src/Contexts/shared/domain/errors';
import { random } from '../../../fixtures/shared';
import { AuthorRepositoryMock } from '../../Authors/__mocks__/AuthorRepositoryMock';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';
import { BookMother } from '../domain/mothers/BookMother';
import { BookCreatorRequestMother } from './mothers/BookCreatorRequestMother';

const username = random.word();

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
    const book = BookMother.from(request);

    await updater.run(request, username);

    repository.assertUpdateHasBeenCalledWith(book);
  });

  it('should throw an error when the author is not found', async () => {
    const request = BookCreatorRequestMother.random();
    request.author = 'not-found';

    await expect(updater.run(request, username)).rejects.toThrow(NotFoundError);
  });
});
