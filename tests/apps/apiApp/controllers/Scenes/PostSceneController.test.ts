import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { SceneCreator } from '../../../../../src/Contexts/apiApp/Scenes/application';
import { SceneRepositoryMock } from '../../../../Contexts/apiApp/Scenes/__mocks__/SceneRepositoryMock';
import { CharacterRepositoryMock } from '../../../../Contexts/apiApp/Characters/__mocks__/CharacterRepositoryMock';
import { SceneCreatorRequest } from '../../../../../src/Contexts/apiApp/Scenes/application/interfaces';
import { SceneCreatorRequestMother } from '../../../../Contexts/apiApp/Scenes/application/mothers';
import { UserMother } from '../../../../Contexts/apiApp/Auth/domain/mothers';
import { PostController } from '../../../../../src/apps/apiApp/controllers/shared/PostController';
import { createPostSceneController } from '../../../../../src/apps/apiApp/controllers/Scenes';

jest.mock('../../../../../src/Contexts/apiApp/Scenes/application/SceneCreator');

const username = UserMother.random().username.value;
describe('PostSceneController', () => {
  let service: SceneCreator;
  let controller: PostController<SceneCreator, SceneCreatorRequest>;
  let repository: SceneRepositoryMock;
  let characterRepository: CharacterRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedScene: SceneCreatorRequest;

  beforeEach(() => {
    repository = new SceneRepositoryMock();
    characterRepository = new CharacterRepositoryMock({ find: true });
    service = new SceneCreator(repository, characterRepository);
    controller = createPostSceneController(service) as PostController<
      SceneCreator,
      SceneCreatorRequest
    >;
    expectedScene = SceneCreatorRequestMother.random();
    req = {
      body: expectedScene
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
    it('should create a scene and send status 201', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(service.run).toHaveBeenCalledWith(expectedScene, username);
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if scene creation fails', async () => {
      const error = new Error('Scene creation failed');
      jest.spyOn(service, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
