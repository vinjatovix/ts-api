import { AuthorRemover } from '../../../../../src/Contexts/apiApp/Authors/application';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';
import { random } from '../../../fixtures/shared';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { BookRepositoryMock } from '../../Books/__mocks__/BookRepositoryMock';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';

const username = random.word();
const request = RequestByIdMother.create(UuidMother.random());

describe('AuthorRemover', () => {
  let repository: AuthorRepositoryMock;
  let bookRepository: BookRepositoryMock;
  let service: AuthorRemover;

  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    bookRepository = new BookRepositoryMock();
    service = new AuthorRemover(repository, bookRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove an author', async () => {
    repository.setFindable(true);

    await service.run(request, username);

    repository.assertRemoveHasBeenCalledWith(request.id);
  });

  it('should fail when the author has associated books', async () => {
    bookRepository.setFindable(true);

    await expect(service.run(request, username)).rejects.toThrow(
      `Author <${request.id}> has associated books`
    );
  });

  it('should not throw an error when the author is not found', async () => {
    await expect(service.run(request, username)).resolves.toBeUndefined();
  });
});
