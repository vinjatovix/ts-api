import { BookPatcher } from '../../../../../src/Contexts/apiApp/Books/application/BookPatcher';

import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';
import { BookMother } from '../domain/mothers/BookMother';

import { BookCreatorRequestMother } from './mothers/BookCreatorRequestMother';

describe('BookPatcher', () => {
  let repository: BookRepositoryMock;
  let updater: BookPatcher;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    updater = new BookPatcher(repository);
  });

  it('should update a valid book', async () => {
    const request = BookCreatorRequestMother.random();
    const book = BookMother.from(request);

    await updater.run(request);

    repository.assertUpdateHasBeenCalledWith(book);
  });
});
