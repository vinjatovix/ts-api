import { BookRemover } from '../../../../../src/Contexts/apiApp/Books/application/BookRemover';
import { random } from '../../../fixtures/shared';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';
import { UuidMother } from '../../../fixtures/shared/domain/mothers/UuidMother';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';

const username = random.word();

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
    const request = RequestByIdMother.create(UuidMother.random());

    await remover.run(request, username);

    repository.assertRemoveHasBeenCalledWith(request.id);
  });

  it('should not throw an error when the book is not found', async () => {
    const request = RequestByIdMother.inexistentId();

    await expect(remover.run(request, username)).resolves.toBeUndefined();
  });
});
