import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { GetAllAuthorsController } from '../../../../../src/apps/apiApp/controllers/Authors';
import { AllAuthorsFinder } from '../../../../../src/Contexts/apiApp/Authors/application';
import { Author } from '../../../../../src/Contexts/apiApp/Authors/domain';
import { AuthorRepositoryMock } from '../../../../Contexts/apiApp/Authors/__mocks__/AuthorRepositoryMock';
import { AuthorMother } from '../../../../Contexts/apiApp/Authors/domain/mothers';

describe('GetAllAuthorsController', () => {
  let allAuthorsFinder: AllAuthorsFinder;
  let controller: GetAllAuthorsController;
  let repository: AuthorRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    allAuthorsFinder = new AllAuthorsFinder(repository);
    controller = new GetAllAuthorsController(allAuthorsFinder);
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('run', () => {
    it('should get all authors and send 200 status', async () => {
      const authors: Author[] = AuthorMother.randomList(3);
      jest
        .spyOn(allAuthorsFinder, 'run')
        .mockResolvedValueOnce(authors.map((author) => author.toPrimitives()));

      await controller.run(req as Request, res as Response, next);

      expect(allAuthorsFinder.run).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(
        authors.map((author) => author.toPrimitives())
      );
    });

    it('should call next with the error if call fails', async () => {
      const error = new Error('Author creation failed');
      jest.spyOn(allAuthorsFinder, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
