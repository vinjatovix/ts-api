import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock'; // Importa el BookRepositoryMock
import { BookUpdater } from '../../../../../src/Contexts/apiApp/Books/application/BookUpdater';
import { PutBookController } from '../../../../../src/apps/apiApp/controllers/Books/PutBookController';
import { BookCreatorRequestMother } from '../../../../Contexts/apiApp/Books/application/BookCreatorRequestMother';
import { BookCreatorRequest } from '../../../../../src/Contexts/apiApp/Books/application/BookCreatorRequest';

jest.mock('../../../../../src/Contexts/apiApp/Books/application/BookUpdater');

describe('PutBookController', () => {
  let bookUpdater: BookUpdater;
  let controller: PutBookController;
  let repository: BookRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedBook: BookCreatorRequest;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    bookUpdater = new BookUpdater(repository);
    controller = new PutBookController(bookUpdater);
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

      expect(bookUpdater.run).toHaveBeenCalledWith(expectedBook);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if book update fails', async () => {
      const error = new Error('Book update failed');
      jest.spyOn(bookUpdater, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
