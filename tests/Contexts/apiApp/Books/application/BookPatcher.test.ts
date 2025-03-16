import { BookPatcher } from '../../../../../src/Contexts/apiApp/Books/application';
import { BookPatch } from '../../../../../src/Contexts/apiApp/Books/domain';
import { UserMother } from '../../Auth/domain/mothers';
import { AuthorRepositoryMock } from '../../Authors/__mocks__/AuthorRepositoryMock';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';
import { BookCreatorRequestMother } from './mothers';

const username = UserMother.random().username;
const DEFAULT_REQUEST = BookCreatorRequestMother.random();

describe('BookPatcher', () => {
  let repository: BookRepositoryMock;
  let authorRepository: AuthorRepositoryMock;
  let service: BookPatcher;

  beforeEach(() => {
    repository = new BookRepositoryMock({ find: true });
    authorRepository = new AuthorRepositoryMock({ find: true });
    service = new BookPatcher(repository, authorRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a valid book', async () => {
    const bookPatch = BookPatch.fromPrimitives(DEFAULT_REQUEST);

    await service.run(DEFAULT_REQUEST, username.value);

    repository.assertUpdateHasBeenCalledWith(
      expect.objectContaining(bookPatch),
      username
    );
  });

  it('should throw an error when the book is not found', async () => {
    repository.setFindable(false);

    await expect(service.run(DEFAULT_REQUEST, username.value)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });

  it('should throw an error when the author is not found', async () => {
    authorRepository.setFindable(false);

    await expect(service.run(DEFAULT_REQUEST, username.value)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });

  it('should throw an error if there are no changes with the stored document', async () => {
    await expect(
      service.run({ id: DEFAULT_REQUEST.id }, username.value)
    ).rejects.toThrow(
      expect.objectContaining({ name: 'InvalidArgumentError' })
    );
  });
});
