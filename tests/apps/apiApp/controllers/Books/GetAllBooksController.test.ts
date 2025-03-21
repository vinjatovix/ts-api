import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AllBooksFinder } from '../../../../../src/Contexts/apiApp/Books/application';
import { Book } from '../../../../../src/Contexts/apiApp/Books/domain';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock';
import { BookMother } from '../../../../Contexts/apiApp/Books/domain/mothers';
import { RequestOptions } from '../../../../../src/apps/apiApp/shared/interfaces';
import { BookPrimitives } from '../../../../../src/Contexts/apiApp/Books/domain/interfaces';
import { createGetAllBooksController } from '../../../../../src/apps/apiApp/controllers/Books';
import { GetAllController } from '../../../../../src/apps/apiApp/controllers/shared/GetAllController';

describe('GetAllBooksController', () => {
  let service: AllBooksFinder;
  let controller: GetAllController<
    AllBooksFinder,
    Partial<RequestOptions>,
    BookPrimitives[]
  >;
  let repository: BookRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    service = new AllBooksFinder(repository);
    controller = createGetAllBooksController(service) as GetAllController<
      AllBooksFinder,
      Partial<RequestOptions>,
      BookPrimitives[]
    >;
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
        .spyOn(service, 'run')
        .mockResolvedValueOnce(books.map((book) => book.toPrimitives()));

      await controller.run(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(
        books.map((book) => book.toPrimitives())
      );
    });

    it('should call next with the error if call fails', async () => {
      const error = new Error('Book creation failed');
      jest.spyOn(service, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should call allBooksFinder with the qs', async () => {
      const options = { include: ['author'], fields: ['title', 'author'] };
      req.query = options;
      jest.spyOn(service, 'run').mockResolvedValueOnce([]);

      await controller.run(req as Request, res as Response, next);

      expect(service.run).toHaveBeenCalledWith(options);
    });
  });
});
