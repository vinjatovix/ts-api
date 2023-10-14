import { Book } from '../../../../../../src/Contexts/apiApp/Books/domain/Book';
import { FileBookRepository } from '../../../../../../src/Contexts/apiApp/Books/infraestructure/persistence/FileBookRepository';
import { random } from '../../../../fixtures/shared';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/value-object/Uuid';

describe('FileBookRepository', () => {
  it('should save a book', async () => {
    const expectedBook = new Book({
      id: new Uuid(random.uuid()),
      title: random.word(),
      author: random.word(),
      isbn: random.integer({ min: 1000, max: 9999 }).toString(),
      releaseDate: random.date().toISOString(),
      pages: random.integer({ min: 100, max: 999 })
    });
    const repository = new FileBookRepository();

    await repository.save(expectedBook);

    const book = await repository.search(expectedBook.id.toString());
    expect(book).toEqual(expectedBook);
  });
});
