import { AuthorRemover } from '../../../../../src/Contexts/apiApp/Authors/application';
import { random } from '../../../fixtures/shared';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';
import { UuidMother } from '../../../fixtures/shared/domain/mothers/UuidMother';
import { BookRepositoryMock } from '../../Books/__mocks__/BookRepositoryMock';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';

const username = random.word();
const request = RequestByIdMother.create(UuidMother.random());

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
    repository.setFindable(true);

    await remover.run(request, username);

    repository.assertRemoveHasBeenCalledWith(request.id);
  });

  it('should fail when the author has associated books', async () => {
    bookRepository.findByQueryMock.mockResolvedValue([{}]);

    await expect(remover.run(request, username)).rejects.toThrow(
      `Author <${request.id}> has associated books`
    );
  });

  it('should not throw an error when the author is not found', async () => {
    await expect(remover.run(request, username)).resolves.toBeUndefined();
  });
});
