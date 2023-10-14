import { FileBookRepository } from '../../../../../../src/Contexts/apiApp/Books/infraestructure/persistence/FileBookRepository';
import { BookMother } from '../../domain/BookMother';

describe('FileBookRepository', () => {
  it('should save a book', async () => {
    const expectedBook = BookMother.random();
    const repository = new FileBookRepository();

    await repository.save(expectedBook);

    const book = await repository.search(expectedBook.id.toString());
    expect(book).toEqual(expectedBook);
  });

  it('should return null when the book is not found', async () => {
    const repository = new FileBookRepository();

    const book = await repository.search('invalid-id');

    expect(book).toBeNull();
  });

  it('should return the book when the book is found', async () => {
    const expectedBook = BookMother.random();
    const repository = new FileBookRepository();
    await repository.save(expectedBook);

    const book = await repository.search(expectedBook.id.toString());

    expect(book).toEqual(expectedBook);
  });
});
