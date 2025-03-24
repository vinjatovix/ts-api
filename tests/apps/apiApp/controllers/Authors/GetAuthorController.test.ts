import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthorFinder } from '../../../../../src/Contexts/apiApp/Authors/application';
import { GetAuthorController } from '../../../../../src/apps/apiApp/controllers/Authors';
import { Author } from '../../../../../src/Contexts/apiApp/Authors/domain';
import { AuthorRepositoryMock } from '../../../../Contexts/apiApp/Authors/__mocks__/AuthorRepositoryMock';
import { random } from '../../../../Contexts/fixtures/shared';
import { AuthorMother } from '../../../../Contexts/apiApp/Authors/domain/mothers';

const AUTHOR_UUID = random.uuid();

describe('GetAuthorController', () => {
  let authorFinder: AuthorFinder;
  let controller: GetAuthorController;
  let repository: AuthorRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    authorFinder = new AuthorFinder(repository);
    controller = new GetAuthorController(authorFinder);
    req = { params: { id: AUTHOR_UUID } };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('run', () => {
    it('should get an author and send 200 status', async () => {
      const author: Author = AuthorMother.random();
      jest
        .spyOn(authorFinder, 'run')
        .mockResolvedValueOnce(author.toPrimitives());

      await controller.run(req as Request, res as Response, next);

      expect(authorFinder.run).toHaveBeenCalledWith({ id: AUTHOR_UUID });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(author.toPrimitives());
    });

    it('should call next with the error if author retrieval fails', async () => {
      const error = new Error('Author retrieval failed');
      jest.spyOn(authorFinder, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
