import { AuthorRemover } from '../../../../../src/Contexts/apiApp/Authors/application';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';
import { UuidMother } from '../../../fixtures/shared/domain/mothers/UuidMother';
import { BookRepositoryMock } from '../../Books/__mocks__/BookRepositoryMock';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';

describe('AuthorRemover', () => {
  let repository: AuthorRepositoryMock;
  let bookRepository: BookRepositoryMock;
  let remover: AuthorRemover;

  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    bookRepository = new BookRepositoryMock();
    bookRepository.findByQueryMock.mockResolvedValue([]);
    remover = new AuthorRemover(repository, bookRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove an author', async () => {
    const request = RequestByIdMother.create(UuidMother.random());

    await remover.run(request);

    repository.assertRemoveHasBeenCalledWith(request.id);
  });

  it('should fail when the author has books', async () => {
    const request = RequestByIdMother.create(UuidMother.random());
    bookRepository.findByQueryMock.mockResolvedValue([{}]);

    await expect(remover.run(request)).rejects.toThrow(
      `Author <${request.id}> has books`
    );
  });

  it('should not throw an error when the author is not found', async () => {
    const request = RequestByIdMother.inexistentId();

    await expect(remover.run(request)).resolves.toBeUndefined();
  });
});
