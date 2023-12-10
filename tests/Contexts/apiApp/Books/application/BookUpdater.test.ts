import { BookUpdater } from '../../../../../src/Contexts/apiApp/Books/application/BookUpdater';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';
import { BookMother } from '../domain/BookMother';
import { BookCreatorRequestMother } from './BookCreatorRequestMother';

describe('BookUpdated', () => {
  let repository: BookRepositoryMock;
  let updater: BookUpdater;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    updater = new BookUpdater(repository);
  });

  it('should update a valid book', async () => {
    const request = BookCreatorRequestMother.random();
    const book = BookMother.from(request);

    await updater.run(request);

    repository.assertSaveHasBeenCalledWith(book);
  });
});
