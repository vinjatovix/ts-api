import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { GetAllScenesController } from '../../../../../src/apps/apiApp/controllers/Scenes';
import { AllScenesFinder } from '../../../../../src/Contexts/apiApp/Scenes/application';
import { SceneRepositoryMock } from '../../../../Contexts/apiApp/Scenes/__mocks__/SceneRepositoryMock';
import { SceneMother } from '../../../../Contexts/apiApp/Scenes/domain/mothers';

describe('GetAllScenesController', () => {
  let repository: SceneRepositoryMock;
  let service: AllScenesFinder;
  let controller: GetAllScenesController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new SceneRepositoryMock();
    service = new AllScenesFinder(repository);
    controller = new GetAllScenesController(service);
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('run', () => {
    it('should get all scenes and send 200 status', async () => {
      const scenes = [SceneMother.random()];
      jest
        .spyOn(service, 'run')
        .mockResolvedValueOnce(scenes.map((scene) => scene.toPrimitives()));

      await controller.run(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(
        scenes.map((scene) => scene.toPrimitives())
      );
    });

    it('should call next with the error if call fails', async () => {
      const error = new Error('Scene creation failed');
      jest.spyOn(service, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should call allScenesFinder with the qs', async () => {
      const options = { include: ['characters'], fields: ['description'] };
      req.query = options;
      jest.spyOn(service, 'run').mockResolvedValueOnce([]);

      await controller.run(req as Request, res as Response, next);

      expect(service.run).toHaveBeenCalledWith(options);
    });
  });
});
