import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { PatchBookController } from '../../../../../src/apps/apiApp/controllers/Books';
import {
  BookCreatorRequest,
  BookPatcher
} from '../../../../../src/Contexts/apiApp/Books/application';

import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock'; // Importa el BookRepositoryMock
import { BookCreatorRequestMother } from '../../../../Contexts/apiApp/Books/application/mothers';

jest.mock('../../../../../src/Contexts/apiApp/Books/application/BookPatcher');

describe('PatchBookController', () => {
  let bookPatcher: BookPatcher;
  let controller: PatchBookController;
  let repository: BookRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedBook: BookCreatorRequest;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    bookPatcher = new BookPatcher(repository);
    controller = new PatchBookController(bookPatcher);
    expectedBook = BookCreatorRequestMother.random();
    req = {
      params: { id: expectedBook.id },
      body: expectedBook
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('run', () => {
    it('should update a book and send 200 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(bookPatcher.run).toHaveBeenCalledWith(expectedBook);
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
