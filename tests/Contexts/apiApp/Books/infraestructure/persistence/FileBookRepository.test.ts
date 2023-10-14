import { FileBookRepository } from '../../../../../../src/Contexts/apiApp/Books/infraestructure/persistence/FileBookRepository';
import { BookIdMother } from '../../domain/BookIdMother';
import { BookMother } from '../../domain/BookMother';

describe('FileBookRepository', () => {
  describe('Save', () => {
    it('should save a book', async () => {
      const expectedBook = BookMother.random();
      const repository = new FileBookRepository();

      await repository.save(expectedBook);

      const book = await repository.search(expectedBook.id.value);
      expect(book).toEqual(expectedBook);
    });
  });

  describe('Find', () => {
    it('should return null when the book is not found', async () => {
      const repository = new FileBookRepository();
      const notFoundId = BookIdMother.random().toString();

      const book = await repository.search(notFoundId);

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

  describe('Remove', () => {
    it('should remove a book', async () => {
      const expectedBook = BookMother.random();
      const repository = new FileBookRepository();
      await repository.save(expectedBook);

      await repository.remove(expectedBook.id.toString());

      const book = await repository.search(expectedBook.id.toString());
      expect(book).toBeNull();
    });

    it('should not throw an error when the book is not found', async () => {
      const repository = new FileBookRepository();
      const notFoundId = BookIdMother.random().toString();

      await expect(repository.remove(notFoundId)).resolves.toBeUndefined();
    });
  });

  describe('FindAll', () => {
    it('should return a list of books', async () => {
      const expectedBook = BookMother.random();
      const repository = new FileBookRepository();
      await repository.save(expectedBook);

      const books = await repository.findAll();

      expect(books).toEqual(expect.arrayContaining([expectedBook]));
    });
  });
});
