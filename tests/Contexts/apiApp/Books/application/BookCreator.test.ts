import { BookCreator } from '../../../../../src/Contexts/apiApp/Books/application/BookCreator';
import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { random } from '../../../fixtures/shared';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';

describe('BookCreator', () => {
  let repository: BookRepositoryMock;

  beforeEach(() => {
    repository = new BookRepositoryMock();
  });

  it('should create a valid book', async () => {
    const id = random.uuid();
    const title = random.word();
    const author = random.word();
    const isbn = random.integer().toString();
    const releaseDate = random.date().toISOString();
    const pages = random.integer();
    const expectedBook = new Book(id, title, author, isbn, releaseDate, pages);

    const creator = new BookCreator(repository);
    await creator.run(id, title, author, isbn, releaseDate, pages);

    repository.assertSaveHasBeenCalledWith(expectedBook);
  });
});
