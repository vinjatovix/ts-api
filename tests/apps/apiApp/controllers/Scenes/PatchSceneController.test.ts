import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  SceneCreatorRequest,
  ScenePatcherRequest
} from '../../../../../src/Contexts/apiApp/Scenes/application/interfaces';
import { ScenePatcher } from '../../../../../src/Contexts/apiApp/Scenes/application';
import { CharacterRepositoryMock } from '../../../../Contexts/apiApp/Characters/__mocks__/CharacterRepositoryMock';
import { SceneRepositoryMock } from '../../../../Contexts/apiApp/Scenes/__mocks__/SceneRepositoryMock';
import { SceneCreatorRequestMother } from '../../../../Contexts/apiApp/Scenes/application/mothers';
import { random } from '../../../../Contexts/fixtures/shared';
import { PatchController } from '../../../../../src/apps/apiApp/controllers/shared/PatchController';
import { createPatchSceneController } from '../../../../../src/apps/apiApp/controllers/Scenes';

jest.mock('../../../../../src/Contexts/apiApp/Scenes/application/ScenePatcher');

const username = random.word;

describe('PatchSceneController', () => {
  let service: ScenePatcher;
  let controller: PatchController<ScenePatcher, ScenePatcherRequest>;
  let repository: SceneRepositoryMock;
  let characterRepository: CharacterRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedScene: SceneCreatorRequest;

  beforeEach(() => {
    repository = new SceneRepositoryMock();
    characterRepository = new CharacterRepositoryMock();
    service = new ScenePatcher(repository, characterRepository);
    controller = createPatchSceneController(service) as PatchController<
      ScenePatcher,
      ScenePatcherRequest
    >;
    expectedScene = SceneCreatorRequestMother.random();
    req = { params: { id: expectedScene.id }, body: expectedScene };
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
    it('should update a scene and return status 200', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(service.run).toHaveBeenCalledWith(expectedScene, username);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if scene update fails', async () => {
      const error = new Error('scene update failed');
      jest.spyOn(service, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
