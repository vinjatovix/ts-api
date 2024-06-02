import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PostBookController } from '../../../../../src/apps/apiApp/controllers/Books';
import {
  BookCreator,
  BookCreatorRequest
} from '../../../../../src/Contexts/apiApp/Books/application';
import { AuthorRepositoryMock } from '../../../../Contexts/apiApp/Authors/__mocks__/AuthorRepositoryMock';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock'; // Importa el BookRepositoryMock
import { BookCreatorRequestMother } from '../../../../Contexts/apiApp/Books/application/mothers/BookCreatorRequestMother';
import { random } from '../../../../Contexts/fixtures/shared';

jest.mock('../../../../../src/Contexts/apiApp/Books/application/BookCreator');

const username = random.word();

describe('PostBookController', () => {
  let bookCreator: BookCreator;
  let controller: PostBookController;
  let repository: BookRepositoryMock;
  let authorRepository: AuthorRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedBook: BookCreatorRequest;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    bookCreator = new BookCreator(repository, authorRepository);
    controller = new PostBookController(bookCreator);
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
