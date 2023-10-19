import httpStatus from 'http-status';
import { AllBooksFinder } from '../../../../../src/Contexts/apiApp/Books/application/AllBooksFinder';
import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock';
import { BookMother } from '../../../../Contexts/apiApp/Books/domain/BookMother';
import { GetAllBooksController } from '../../../../../src/apps/apiApp/controllers/Books/GetAllBooksController';
import { Request, Response } from 'express';

describe('GetAllBooksController', () => {
  let allBooksFinder: AllBooksFinder;
  let controller: GetAllBooksController;
  let repository: BookRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    allBooksFinder = new AllBooksFinder(repository);
    controller = new GetAllBooksController(allBooksFinder);
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('run', () => {
    it('should get all books and send 200 status', async () => {
      const books: Book[] = BookMother.randomList(3);
      jest
        .spyOn(allBooksFinder, 'run')
        .mockResolvedValueOnce(books.map((book) => book.asPrimitives()));

      await controller.run(req as Request, res as Response, next);

      expect(allBooksFinder.run).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(
        books.map((book) => book.asPrimitives())
      );
    });
  });
});
