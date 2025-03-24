import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthorPatcher } from '../../../../../src/Contexts/apiApp/Authors/application';
import { AuthorCreatorRequest } from '../../../../../src/Contexts/apiApp/Authors/application/interfaces';
import { AuthorRepositoryMock } from '../../../../Contexts/apiApp/Authors/__mocks__/AuthorRepositoryMock';
import { AuthorCreatorRequestMother } from '../../../../Contexts/apiApp/Authors/application/mothers';
import { random } from '../../../../Contexts/fixtures/shared';
import { PatchController } from '../../../../../src/apps/apiApp/controllers/shared/PatchController';
import { createPatchAuthorController } from '../../../../../src/apps/apiApp/controllers/Authors';

jest.mock(
  '../../../../../src/Contexts/apiApp/Authors/application/AuthorPatcher'
);

const username = random.word();

describe('PatchAuthorController', () => {
  let authorPatcher: AuthorPatcher;
  let controller: PatchController<AuthorPatcher, AuthorCreatorRequest>;
  let repository: AuthorRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedAuthor: AuthorCreatorRequest;

  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    authorPatcher = new AuthorPatcher(repository);
    controller = createPatchAuthorController(authorPatcher) as PatchController<
      AuthorPatcher,
      AuthorCreatorRequest
    >;
    expectedAuthor = AuthorCreatorRequestMother.random();
    req = {
      params: { id: expectedAuthor.id },
      body: expectedAuthor
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
    it('should update an author and send 200 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(authorPatcher.run).toHaveBeenCalledWith(expectedAuthor, {
        username
      });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
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
