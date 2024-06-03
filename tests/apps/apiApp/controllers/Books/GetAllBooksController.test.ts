import httpStatus from 'http-status';
import { GetAllBooksController } from '../../../../../src/apps/apiApp/controllers/Books';
import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { AllBooksFinder } from '../../../../../src/Contexts/apiApp/Books/application';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock';
import { BookMother } from '../../../../Contexts/apiApp/Books/domain/mothers/BookMother';
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
    req = { query: {} };
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
        .mockResolvedValueOnce(books.map((book) => book.toPrimitives()));

      await controller.run(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(
        books.map((book) => book.toPrimitives())
      );
    });

    it('should call next with the error if call fails', async () => {
      const error = new Error('Book creation failed');
      jest.spyOn(allBooksFinder, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should call allBooksFinder with the qs', async () => {
      const options = { include: ['author'], fields: ['title', 'author'] };
      req.query = options;
      jest.spyOn(allBooksFinder, 'run').mockResolvedValueOnce([]);

      await controller.run(req as Request, res as Response, next);

      expect(allBooksFinder.run).toHaveBeenCalledWith(options);
    });
  });
});
