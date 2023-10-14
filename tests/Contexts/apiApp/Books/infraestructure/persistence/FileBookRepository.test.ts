import { Book } from '../../../../../../src/Contexts/apiApp/Books/domain/Book';
import { FileBookRepository } from '../../../../../../src/Contexts/apiApp/Books/infraestructure/persistence/FileBookRepository';
import { random } from '../../../../fixtures/shared';

describe('FileBookRepository', () => {
  it('should save a book', async () => {
    const expectedBook = new Book(
      random.uuid(true),
      random.word(),
      random.word(),
      random.integer({ min: 1000, max: 9999 }).toString(),
      random.date().toISOString(),
      random.integer({ min: 100, max: 999 })
    );
    const repository = new FileBookRepository();

    await repository.save(expectedBook);

    const book = await repository.search(expectedBook.id);
    expect(book).toEqual(expectedBook);
  });
});
