import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { GetSceneController } from '../../../../../src/apps/apiApp/controllers/Scenes';
import { SceneFinder } from '../../../../../src/Contexts/apiApp/Scenes/application';
import { SceneRepositoryMock } from '../../../../Contexts/apiApp/Scenes/__mocks__/SceneRepositoryMock';
import { SceneMother } from '../../../../Contexts/apiApp/Scenes/domain/mothers';
import { random } from '../../../../Contexts/fixtures/shared';

const SCENE_ID = random.uuid();

describe('GetSceneController', () => {
  let service: SceneFinder;
  let controller: GetSceneController;
  let repository: SceneRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new SceneRepositoryMock();
    service = new SceneFinder(repository);
    controller = new GetSceneController(service);
    req = { params: { id: SCENE_ID }, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('run', () => {
    it('should get a scene and send 200 status', async () => {
      const scene = SceneMother.random();
      jest.spyOn(service, 'run').mockResolvedValueOnce(scene.toPrimitives());

      await controller.run(req as Request, res as Response, next);

      expect(service.run).toHaveBeenCalledWith({ id: SCENE_ID }, {});
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(scene.toPrimitives());
    });

    it('should call next with the error if scene retrieval fails', async () => {
      const error = new Error('Scene retrieval failed');
      jest.spyOn(service, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should pass the qs to the finder', async () => {
      const scene = SceneMother.random();
      const options = {
        include: ['characters.book.author'],
        fields: ['description']
      };
      req.query = options;
      jest.spyOn(service, 'run').mockResolvedValueOnce(scene.toPrimitives());

      await controller.run(req as Request, res as Response, next);

      expect(service.run).toHaveBeenCalledWith({ id: SCENE_ID }, options);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(scene.toPrimitives());
    });
  });
});
