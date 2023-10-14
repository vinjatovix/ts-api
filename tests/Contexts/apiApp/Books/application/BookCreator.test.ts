import { BookCreator } from '../../../../../src/Contexts/apiApp/Books/application/BookCreator';
import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { Uuid } from '../../../../../src/Contexts/shared/domain/value-object/Uuid';
import { random } from '../../../fixtures/shared';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';

describe('BookCreator', () => {
  let repository: BookRepositoryMock;
  let creator: BookCreator;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    creator = new BookCreator(repository);
  });

  it('should create a valid book', async () => {
    const id = new Uuid(random.uuid());
    const title = random.word();
    const author = random.word();
    const isbn = random.integer().toString();
    const releaseDate = random.date().toISOString();
    const pages = random.integer();

    const expectedBook = new Book({
      id,
      title,
      author,
      isbn,
      releaseDate,
      pages
    });

    await creator.run({
      id: id.value,
      title,
      author,
      isbn,
      releaseDate,
      pages
    });

    repository.assertSaveHasBeenCalledWith(expectedBook);
  });
});
