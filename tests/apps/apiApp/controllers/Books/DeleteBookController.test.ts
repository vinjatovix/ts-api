import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { DeleteBookController } from '../../../../../src/apps/apiApp/controllers/Books';
import { BookRemover } from '../../../../../src/Contexts/apiApp/Books/application';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock';
import { random } from '../../../../Contexts/fixtures/shared';
import { CharacterRepositoryMock } from '../../../../Contexts/apiApp/Characters/__mocks__/CharacterRepositoryMock';

jest.mock('../../../../../src/Contexts/apiApp/Books/application/BookRemover');

const username = random.word();

describe('DeleteBookController', () => {
  let bookRemover: BookRemover;
  let controller: DeleteBookController;
  let repository: BookRepositoryMock;
  let characterRepository: CharacterRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    characterRepository = new CharacterRepositoryMock();
    bookRemover = new BookRemover(repository, characterRepository);
    controller = new DeleteBookController(bookRemover);
    req = { params: { id: '1' } };
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

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('run', () => {
    it('should delete a book and send 204 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(bookRemover.run).toHaveBeenCalledWith({ id: '1' }, username);
      expect(res.status).toHaveBeenCalledWith(httpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if deletion fails', async () => {
      const error = new Error('Deletion failed');
      jest.spyOn(bookRemover, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
