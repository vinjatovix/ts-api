import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookCreator } from '../../../../../src/Contexts/apiApp/Books/application';
import { BookCreatorRequest } from '../../../../../src/Contexts/apiApp/Books/application/interfaces';
import { AuthorRepositoryMock } from '../../../../Contexts/apiApp/Authors/__mocks__/AuthorRepositoryMock';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock';
import { BookCreatorRequestMother } from '../../../../Contexts/apiApp/Books/application/mothers';
import { random } from '../../../../Contexts/fixtures/shared';
import { PostController } from '../../../../../src/apps/apiApp/controllers/shared/PostController';
import { createPostBookController } from '../../../../../src/apps/apiApp/controllers/Books';

jest.mock('../../../../../src/Contexts/apiApp/Books/application/BookCreator');

const username = random.word();

describe('PostBookController', () => {
  let bookCreator: BookCreator;
  let controller: PostController<BookCreator, BookCreatorRequest>;
  let repository: BookRepositoryMock;
  let authorRepository: AuthorRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedBook: BookCreatorRequest;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    authorRepository = new AuthorRepositoryMock();
    bookCreator = new BookCreator(repository, authorRepository);
    controller = createPostBookController(bookCreator) as PostController<
      BookCreator,
      BookCreatorRequest
    >;
    expectedBook = BookCreatorRequestMother.random();
    req = {
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
    it('should create a book and send 201 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(bookCreator.run).toHaveBeenCalledWith(expectedBook, username);
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if book creation fails', async () => {
      const error = new Error('Book creation failed');
      jest.spyOn(bookCreator, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
