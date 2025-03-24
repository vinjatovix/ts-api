import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { DeleteSceneController } from '../../../../../src/apps/apiApp/controllers/Scenes';
import { SceneRemover } from '../../../../../src/Contexts/apiApp/Scenes/application';
import { SceneRepositoryMock } from '../../../../Contexts/apiApp/Scenes/__mocks__/SceneRepositoryMock';
import { random } from '../../../../Contexts/fixtures/shared';

jest.mock('../../../../../src/Contexts/apiApp/Scenes/application/SceneRemover');

const username = random.word();

describe('DeleteSceneController', () => {
  let service: SceneRemover;
  let controller: DeleteSceneController;
  let repository: SceneRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new SceneRepositoryMock();
    service = new SceneRemover(repository);
    controller = new DeleteSceneController(service);
    req = { params: { id: '1' } };
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

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('run', () => {
    it('should delete a scene and send 204 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(service.run).toHaveBeenCalledWith({ id: '1' }, username);
      expect(res.status).toHaveBeenCalledWith(httpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if deletion fails', async () => {
      const error = new Error('Deletion failed');
      jest.spyOn(service, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
