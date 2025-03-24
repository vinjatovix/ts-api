import { BookFinder } from '../../../../../src/Contexts/apiApp/Books/application/BookFinder';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';
import { UuidMother } from '../../../fixtures/shared/domain/mothers/UuidMother';
import { BookCreatorRequestMother } from './mothers';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';

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
    const request = RequestByIdMother.create(UuidMother.random());

    await finder.run(request);

    repository.assertSearchHasBeenCalledWith(request.id);
  });

  it('should throw an error when the book is not found', async () => {
    const request = BookCreatorRequestMother.inexistentId();

    await expect(finder.run(request)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });
});
