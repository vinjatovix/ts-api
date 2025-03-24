import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthorCreator } from '../../../../../src/Contexts/apiApp/Authors/application';
import { AuthorCreatorRequest } from '../../../../../src/Contexts/apiApp/Authors/application/interfaces';
import { AuthorRepositoryMock } from '../../../../Contexts/apiApp/Authors/__mocks__/AuthorRepositoryMock';
import { AuthorCreatorRequestMother } from '../../../../Contexts/apiApp/Authors/application/mothers';
import { random } from '../../../../Contexts/fixtures/shared';
import { PostController } from '../../../../../src/apps/apiApp/controllers/shared/PostController';
import { createPostAuthorController } from '../../../../../src/apps/apiApp/controllers/Authors';

jest.mock(
  '../../../../../src/Contexts/apiApp/Authors/application/AuthorCreator'
);

const username = random.word();

describe('PostAuthorController', () => {
  let authorCreator: AuthorCreator;
  let controller: PostController<AuthorCreator, AuthorCreatorRequest>;
  let repository: AuthorRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedAuthor: AuthorCreatorRequest;

  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    authorCreator = new AuthorCreator(repository);
    controller = createPostAuthorController(authorCreator) as PostController<
      AuthorCreator,
      AuthorCreatorRequest
    >;
    expectedAuthor = AuthorCreatorRequestMother.random();
    req = {
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
    it('should create an author and send 201 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(authorCreator.run).toHaveBeenCalledWith(expectedAuthor, username);
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if author creation fails', async () => {
      const error = new Error('Author creation failed');
      jest.spyOn(authorCreator, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
