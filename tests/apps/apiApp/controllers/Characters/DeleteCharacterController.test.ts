import { DeleteCharacterController } from '../../../../../src/apps/apiApp/controllers/Characters/DeleteCharacterController';
import { CharacterRemover } from '../../../../../src/Contexts/apiApp/Characters/application/CharacterRemover';
import { random } from '../../../../Contexts/fixtures/shared';
import { CharacterRepositoryMock } from '../../../../Contexts/apiApp/Characters/__mocks__/CharacterRepositoryMock';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { SceneRepositoryMock } from '../../../../Contexts/apiApp/Scenes/__mocks__/SceneRepositoryMock';

jest.mock(
  '../../../../../src/Contexts/apiApp/Characters/application/CharacterRemover'
);

const username = random.word();
const id = random.uuid();

describe('DeleteCharacterController', () => {
  let service: CharacterRemover;
  let controller: DeleteCharacterController;
  let repository: CharacterRepositoryMock;
  let sceneRepository: SceneRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new CharacterRepositoryMock();
    sceneRepository = new SceneRepositoryMock();
    service = new CharacterRemover(repository, sceneRepository);
    controller = new DeleteCharacterController(service);
    req = { params: { id } };
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
    jest.clearAllMocks();
  });

  it('should delete a character and send 204 status', async () => {
    await controller.run(req as Request, res as Response, next);

    expect(service.run).toHaveBeenCalledWith({ id }, username);
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
