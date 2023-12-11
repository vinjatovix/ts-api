import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock'; // Importa el BookRepositoryMock
import { BookFinder } from '../../../../../src/Contexts/apiApp/Books/application';
import { GetBookController } from '../../../../../src/apps/apiApp/controllers/Books';
import { BookMother } from '../../../../Contexts/apiApp/Books/domain/mothers/BookMother';
import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';

jest.mock('../../../../../src/Contexts/apiApp/Books/application/BookFinder');

describe('GetBookController', () => {
  let bookFinder: BookFinder;
  let controller: GetBookController;
  let repository: BookRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    bookFinder = new BookFinder(repository);
    controller = new GetBookController(bookFinder);
    req = { params: { id: '1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('run', () => {
    it('should get a book and send 200 status', async () => {
      const book: Book = BookMother.random();
      jest.spyOn(bookFinder, 'run').mockResolvedValueOnce(book.toPrimitives());

      await controller.run(req as Request, res as Response, next);

      expect(bookFinder.run).toHaveBeenCalledWith({ id: '1' });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(book.toPrimitives());
    });

    it('should call next with the error if book retrieval fails', async () => {
      const error = new Error('Book retrieval failed');
      jest.spyOn(bookFinder, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
