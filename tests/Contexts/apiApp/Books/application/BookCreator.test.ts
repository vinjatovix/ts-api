import { BookCreator } from '../../../../../src/Contexts/apiApp/Books/application';
import { InvalidArgumentError } from '../../../../../src/Contexts/shared/domain/errors/InvalidArgumentError';

import { CreateBookRepositoryMock } from '../__mocks__/CreateBookRepositoryMock';

import { BookMother } from '../domain/mothers';

import { BookCreatorRequestMother } from './mothers';
import { AuthorRepositoryMock } from '../../Authors/__mocks__/AuthorRepositoryMock';
import { NotFoundError } from '../../../../../src/Contexts/shared/domain/errors/NotFoundError';

describe('BookCreator', () => {
  let repository: CreateBookRepositoryMock;
  let creator: BookCreator;
  let authorRepository: AuthorRepositoryMock;

  beforeEach(() => {
    repository = new CreateBookRepositoryMock();
    authorRepository = new AuthorRepositoryMock();
    creator = new BookCreator(repository, authorRepository);
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
    }).toThrow(InvalidArgumentError);
  });

  it('should throw an error when the book author is invalid', async () => {
    expect(() => {
      const request = BookCreatorRequestMother.invalidValue(['author']);
      const book = BookMother.from(request);

      creator.run(request);

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrow(InvalidArgumentError);
  });

  it('should throw an error when the book author is not found', async () => {
    const request = BookCreatorRequestMother.random();
    request.author = 'not-found';

    await expect(creator.run(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw an error when the book isbn is not valid', async () => {
    expect(() => {
      const request = BookCreatorRequestMother.invalidValue(['isbn']);
      const book = BookMother.from(request);

      creator.run(request);

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrow(InvalidArgumentError);
  });

  it('should throw an error when the book release date is not valid', async () => {
    expect(() => {
      const request = BookCreatorRequestMother.invalidValue(['releaseDate']);
      const book = BookMother.from(request);

      creator.run(request);

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrow(InvalidArgumentError);
  });
});
