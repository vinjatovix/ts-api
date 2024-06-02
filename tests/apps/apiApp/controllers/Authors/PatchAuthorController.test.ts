import { Request, Response } from 'express';
import {
  AuthorCreatorRequest,
  AuthorPatcher
} from '../../../../../src/Contexts/apiApp/Authors/application';
import { PatchAuthorController } from '../../../../../src/apps/apiApp/controllers/Authors';
import { AuthorRepositoryMock } from '../../../../Contexts/apiApp/Authors/__mocks__/AuthorRepositoryMock';
import { AuthorCreatorRequestMother } from '../../../../Contexts/apiApp/Authors/application/mothers/AuthorCreatorRequestMother';

jest.mock(
  '../../../../../src/Contexts/apiApp/Authors/application/AuthorPatcher'
);

describe('PatchAuthorController', () => {
  let authorPatcher: AuthorPatcher;
  let controller: PatchAuthorController;
  let repository: AuthorRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedAuthor: AuthorCreatorRequest;

  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    authorPatcher = new AuthorPatcher(repository);
    controller = new PatchAuthorController(authorPatcher);
    expectedAuthor = AuthorCreatorRequestMother.random();
    req = {
      params: { id: expectedAuthor.id },
      body: expectedAuthor
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('run', () => {
    it('should update an author and send 200 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(authorPatcher.run).toHaveBeenCalledWith(expectedAuthor);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if author update fails', async () => {
      const error = new Error('Author update failed');
      jest.spyOn(authorPatcher, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
