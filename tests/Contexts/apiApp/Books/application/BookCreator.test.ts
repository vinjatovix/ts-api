import { BookCreator } from '../../../../../src/Contexts/apiApp/Books/application';
import { UserMother } from '../../Auth/domain/mothers';
import { AuthorRepositoryMock } from '../../Authors/__mocks__/AuthorRepositoryMock';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';
import { BookMother } from '../domain/mothers';
import { BookCreatorRequestMother } from './mothers';

const username = UserMother.random().username.value;

describe('BookCreator', () => {
  let repository: BookRepositoryMock;
  let authorRepository: AuthorRepositoryMock;
  let service: BookCreator;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    authorRepository = new AuthorRepositoryMock();
    service = new BookCreator(repository, authorRepository);
  });

  it('should create a valid book', async () => {
    authorRepository.setFindable(true);
    const request = BookCreatorRequestMother.random();
    const book = BookMother.from(request, username);

    await service.run(request, username);

    repository.assertSaveHasBeenCalledWith(
      expect.objectContaining({
        ...book,
        metadata: expect.objectContaining({
          createdBy: username
        })
      })
    );
  });

  it('should throw an error when the book does exist in the repository', async () => {
    repository.setFindable(true);
    const request = BookCreatorRequestMother.random();

    await expect(service.run(request, username)).rejects.toThrow(
      expect.objectContaining({
        name: 'InvalidArgumentError',
        message: expect.stringContaining('already exists')
      })
    );
  });

  it('should throw an error when the book author is not found', async () => {
    authorRepository.setFindable(false);
    const request = BookCreatorRequestMother.random();

    await expect(service.run(request, username)).rejects.toThrow(
      expect.objectContaining({
        name: 'NotFoundError',
        message: expect.stringContaining(request.author)
      })
    );
  });

  it('should throw an error when the book title is invalid', async () => {
    expect(() => {
      const request = BookCreatorRequestMother.invalidValue(['title']);
      const book = BookMother.from(request, username);

      service.run(request, username);

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));
  });

  it('should throw an error when the book author is invalid', async () => {
    expect(() => {
      const request = BookCreatorRequestMother.invalidValue(['author']);
      const book = BookMother.from(request, username);

      service.run(request, username);

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));
  });

  it('should throw an error when the book author is not found', async () => {
    repository.setFindable(false);
    const request = BookCreatorRequestMother.random();

    await expect(service.run(request, username)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });

  it('should throw an error when the book isbn is not valid', async () => {
    expect(() => {
      const request = BookCreatorRequestMother.invalidValue(['isbn']);
      const book = BookMother.from(request, username);

      service.run(request, username);

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));
  });

  it('should throw an error when the book release date is not valid', async () => {
    expect(() => {
      const request = BookCreatorRequestMother.invalidValue(['releaseDate']);
      const book = BookMother.from(request, username);

      service.run(request, username);

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));
  });
});
