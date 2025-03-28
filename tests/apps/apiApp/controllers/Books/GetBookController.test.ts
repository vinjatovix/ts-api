import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Book } from '../../../../../src/Contexts/apiApp/Books/domain';
import { BookFinder } from '../../../../../src/Contexts/apiApp/Books/application';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock';
import { BookMother } from '../../../../Contexts/apiApp/Books/domain/mothers';
import { random } from '../../../../Contexts/fixtures/shared';
import { GetController } from '../../../../../src/apps/apiApp/controllers/shared/GetController';
import { createGetBookController } from '../../../../../src/apps/apiApp/controllers/Books';
import { RequestOptions } from '../../../../../src/apps/apiApp/shared/interfaces';
import { BookPrimitives } from '../../../../../src/Contexts/apiApp/Books/domain/interfaces';

const BOOK_UUID = random.uuid();

describe('GetBookController', () => {
  let bookFinder: BookFinder;
  let controller: GetController<
    BookFinder,
    Partial<RequestOptions>,
    BookPrimitives
  >;
  let repository: BookRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    bookFinder = new BookFinder(repository);
    controller = createGetBookController(bookFinder) as GetController<
      BookFinder,
      Partial<RequestOptions>,
      BookPrimitives
    >;
    req = { params: { id: BOOK_UUID }, query: {} };
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

      expect(bookFinder.run).toHaveBeenCalledWith({ id: BOOK_UUID }, {});
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(book.toPrimitives());
    });

    it('should call next with the error if book retrieval fails', async () => {
      const error = new Error('Book retrieval failed');
      jest.spyOn(bookFinder, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should pass the qs to the finder', async () => {
      const book: Book = BookMother.random();
      const options = { include: ['author'], fields: ['title', 'author'] };
      req.query = options;
      jest.spyOn(bookFinder, 'run').mockResolvedValueOnce(book.toPrimitives());

      await controller.run(req as Request, res as Response, next);

      expect(bookFinder.run).toHaveBeenCalledWith({ id: BOOK_UUID }, options);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(book.toPrimitives());
    });
  });
});
