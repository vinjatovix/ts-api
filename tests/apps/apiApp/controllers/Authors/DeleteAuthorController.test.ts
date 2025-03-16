import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { DeleteAuthorController } from '../../../../../src/apps/apiApp/controllers/Authors';
import { AuthorRemover } from '../../../../../src/Contexts/apiApp/Authors/application';
import { AuthorRepositoryMock } from '../../../../Contexts/apiApp/Authors/__mocks__/AuthorRepositoryMock';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock';
import { random } from '../../../../Contexts/fixtures/shared';

jest.mock(
  '../../../../../src/Contexts/apiApp/Authors/application/AuthorRemover'
);

const AUTHOR_UUID = random.uuid();
const username = random.word();

describe('DeleteAuthorController', () => {
  let authorRemover: AuthorRemover;
  let controller: DeleteAuthorController;
  let repository: AuthorRepositoryMock;
  let bookRepository: BookRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    bookRepository = new BookRepositoryMock();
    authorRemover = new AuthorRemover(repository, bookRepository);
    controller = new DeleteAuthorController(authorRemover);
    req = { params: { id: AUTHOR_UUID } };
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
    it('should delete an author and send 204 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(authorRemover.run).toHaveBeenCalledWith(
        { id: AUTHOR_UUID },
        username
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if deletion fails', async () => {
      const error = new Error('Deletion failed');
      jest.spyOn(authorRemover, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
