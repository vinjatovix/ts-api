import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock'; // Importa el BookRepositoryMock
import { BookFinder } from '../../../../../src/Contexts/apiApp/Books/application/BookFinder';
import { GetBookController } from '../../../../../src/apps/apiApp/controllers/Books/GetBookController';
import { BookMother } from '../../../../Contexts/apiApp/Books/domain/BookMother';
import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';

jest.mock('../../../../../src/Contexts/apiApp/Books/application/BookFinder');

describe('GetBookController', () => {
  let bookFinder: BookFinder;
  let controller: GetBookController;
  let repository: BookRepositoryMock; // Agrega el repository
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new BookRepositoryMock(); // Crea una instancia del BookRepositoryMock
    bookFinder = new BookFinder(repository); // Pasa el repository a BookFinder
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
      jest.spyOn(bookFinder, 'run').mockResolvedValueOnce(book.asPrimitives());

      await controller.run(req as Request, res as Response, next);

      expect(bookFinder.run).toHaveBeenCalledWith({ id: '1' });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(book.asPrimitives());
    });

    it('should call next with the error if book retrieval fails', async () => {
      const error = new Error('Book retrieval failed');
      jest.spyOn(bookFinder, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
