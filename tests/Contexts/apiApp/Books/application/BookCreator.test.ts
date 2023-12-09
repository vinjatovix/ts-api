import { BookCreator } from '../../../../../src/Contexts/apiApp/Books/application/BookCreator';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';
import { BookCreatorRequestMother } from './BookCreatorRequestMother';
import { BookMother } from '../domain/BookMother';
import { InvalidArgumentError } from '../../../../../src/Contexts/shared/domain/errors/InvalidArgumentError';

describe('BookCreator', () => {
  let repository: BookRepositoryMock;
  let creator: BookCreator;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    creator = new BookCreator(repository);
  });

  it('should create a valid book', async () => {
    const request = BookCreatorRequestMother.random();
    const book = BookMother.from(request);

    await creator.run(request);

    repository.assertSaveHasBeenCalledWith(book);
  });

  it('should throw an error when the book title is invalid', async () => {
    expect(() => {
      const request = BookCreatorRequestMother.invalidValue(['title']);
      const book = BookMother.from(request);

      creator.run(request);

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrowError(InvalidArgumentError);
  });

  it('should throw an error when the book author is invalid', async () => {
    expect(() => {
      const request = BookCreatorRequestMother.invalidValue(['author']);
      const book = BookMother.from(request);

      creator.run(request);

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrowError(InvalidArgumentError);
  });

  it('should throw an error when the book isbn is not valid', async () => {
    expect(() => {
      const request = BookCreatorRequestMother.invalidValue(['isbn']);
      const book = BookMother.from(request);

      creator.run(request);

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrowError(InvalidArgumentError);
  });

  it('should throw an error when the book release date is not valid', async () => {
    expect(() => {
      const request = BookCreatorRequestMother.invalidValue(['releaseDate']);
      const book = BookMother.from(request);

      creator.run(request);

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrowError(InvalidArgumentError);
  });
});
