import container from '../../../../../../src/apps/apiApp/dependency-injection';
import { BookRepository } from '../../../../../../src/Contexts/apiApp/Books/domain/interfaces';
import { EnvironmentArranger } from '../../../../shared/infrastructure/arranger/EnvironmentArranger';
import { BookMother } from '../../domain/mothers';

const repository: BookRepository = container.get(
  'apiApp.Books.domain.BookRepository'
);

const environmentArranger: Promise<EnvironmentArranger> = container.get(
  'apiApp.EnvironmentArranger'
);

describe('MongoBookRepository', () => {
  beforeEach(async () => {
    await (await environmentArranger).arrange();
  });

  afterAll(async () => {
    await (await environmentArranger).arrange();
    await (await environmentArranger).close();
  });

  describe('save', () => {
    it('should save a book', async () => {
      const book = BookMother.random();

      await repository.save(book);
    });
  });

  describe('update', () => {
    it('should update an existing book', async () => {
      const book = BookMother.random();
      await repository.save(book);

      await repository.update(book);

      expect(await repository.search(book.id.value)).toEqual(book);
    });
  });

  describe('search', () => {
    it('should return an existing book', async () => {
      const book = BookMother.random();

      await repository.save(book);

      expect(await repository.search(book.id.value)).toEqual(book);
    });

    it('should not return a non existing book', async () => {
      expect(await repository.search(BookMother.random().id.value)).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return an array of existing books', async () => {
      const book1 = BookMother.random();
      await repository.save(book1);

      const book2 = BookMother.random();
      await repository.save(book2);

      expect(await repository.findAll()).toEqual(
        expect.arrayContaining([book1, book2])
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing book', async () => {
      const book = BookMother.random();
      await repository.save(book);

      await repository.remove(book.id.value);

      expect(await repository.search(book.id.value)).toBeNull();
    });
  });
});
