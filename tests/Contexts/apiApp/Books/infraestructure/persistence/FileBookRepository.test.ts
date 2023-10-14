import { Book } from '../../../../../../src/Contexts/apiApp/Books/domain/Book';
import { FileBookRepository } from '../../../../../../src/Contexts/apiApp/Books/infraestructure/persistence/FileBookRepository';
import { random } from '../../../../fixtures/shared';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/value-object/Uuid';
import { BookTitle } from '../../../../../../src/Contexts/apiApp/Books/domain/BookTitle';
import { BookAuthor } from '../../../../../../src/Contexts/apiApp/Books/domain/BookAuthor';
import { ISBN } from '../../../../../../src/Contexts/apiApp/Books/domain/ISBN';

describe('FileBookRepository', () => {
  it('should save a book', async () => {
    const expectedBook = new Book({
      id: new Uuid(random.uuid()),
      title: new BookTitle(random.word()),
      author: new BookAuthor(random.word()),
      isbn: new ISBN('978-3-16-148410-0'),
      releaseDate: random.date().toISOString(),
      pages: random.integer({ min: 100, max: 999 })
    });
    const repository = new FileBookRepository();

    await repository.save(expectedBook);

    const book = await repository.search(expectedBook.id.toString());
    expect(book).toEqual(expectedBook);
  });
});
