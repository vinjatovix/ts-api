import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookPatcher } from '../../../../../src/Contexts/apiApp/Books/application';
import { AuthorRepositoryMock } from '../../../../Contexts/apiApp/Authors/__mocks__/AuthorRepositoryMock';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock';
import { BookCreatorRequestMother } from '../../../../Contexts/apiApp/Books/application/mothers';
import { random } from '../../../../Contexts/fixtures/shared';
import { PatchController } from '../../../../../src/apps/apiApp/controllers/shared/PatchController';
import { BookPatcherRequest } from '../../../../../src/Contexts/apiApp/Books/application/interfaces/BookPatcherRequest';
import { createPatchBookController } from '../../../../../src/apps/apiApp/controllers/Books';

jest.mock('../../../../../src/Contexts/apiApp/Books/application/BookPatcher');

const username = random.word;

describe('PatchBookController', () => {
  let bookPatcher: BookPatcher;
  let controller: PatchController<BookPatcher, BookPatcherRequest>;
  let repository: BookRepositoryMock;
  let authorRepository: AuthorRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedBook: BookPatcherRequest;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    authorRepository = new AuthorRepositoryMock();
    bookPatcher = new BookPatcher(repository, authorRepository);
    controller = createPatchBookController(bookPatcher) as PatchController<
      BookPatcher,
      BookPatcherRequest
    >;
    expectedBook = BookCreatorRequestMother.random();
    req = {
      params: { id: expectedBook.id },
      body: expectedBook
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      locals: {
        user: {
          username
        }
      }
    };
    next = jest.fn();
  });

  describe('run', () => {
    it('should update a book and send 200 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(bookPatcher.run).toHaveBeenCalledWith(expectedBook, { username });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if book update fails', async () => {
      const error = new Error('Book update failed');
      jest.spyOn(bookPatcher, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
