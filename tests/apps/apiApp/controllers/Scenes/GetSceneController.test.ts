import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { SceneFinder } from '../../../../../src/Contexts/apiApp/Scenes/application';
import { SceneRepositoryMock } from '../../../../Contexts/apiApp/Scenes/__mocks__/SceneRepositoryMock';
import { SceneMother } from '../../../../Contexts/apiApp/Scenes/domain/mothers';
import { random } from '../../../../Contexts/fixtures/shared';
import { GetController } from '../../../../../src/apps/apiApp/controllers/shared/GetController';
import { RequestOptions } from '../../../../../src/apps/apiApp/shared/interfaces';
import { ScenePrimitives } from '../../../../../src/Contexts/apiApp/Scenes/domain/interfaces';
import { createGetSceneController } from '../../../../../src/apps/apiApp/controllers/Scenes';

const SCENE_ID = random.uuid();

describe('GetSceneController', () => {
  let service: SceneFinder;
  let controller: GetController<
    SceneFinder,
    Partial<RequestOptions>,
    ScenePrimitives
  >;
  let repository: SceneRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new SceneRepositoryMock();
    service = new SceneFinder(repository);
    controller = createGetSceneController(service) as GetController<
      SceneFinder,
      Partial<RequestOptions>,
      ScenePrimitives
    >;
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
