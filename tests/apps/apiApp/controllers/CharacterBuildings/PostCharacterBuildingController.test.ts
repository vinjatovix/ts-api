import { CharacterBuildingCreator } from '../../../../../src/Contexts/apiApp/CharacterBuildings/application/CharacterBuildingCreator';
import { UserRepositoryMock } from '../../../../Contexts/apiApp/Auth/__mocks__/UserRepositoryMock';
import { CharacterBuildingRepositoryMock } from '../../../../Contexts/apiApp/CharacterBuildings/__mocks__/CharacterBuildingRepositoryMock';
import { random } from '../../../../Contexts/fixtures/shared';
import { SceneRepository } from '../../../../../src/Contexts/apiApp/Scenes/domain/interfaces/SceneRepository';
import { SceneRepositoryMock } from '../../../../Contexts/apiApp/Scenes/__mocks__/SceneRepositoryMock';
import { Request, Response } from 'express';
import { CharacterBuildingCreatorRequestMother } from '../../../../Contexts/apiApp/CharacterBuildings/application/mothers/CharacterBuildingCreatorRequestMother';
import { PostController } from '../../../../../src/apps/apiApp/controllers/shared/PostController';
import { CharacterBuildingCreatorRequest } from '../../../../../src/Contexts/apiApp/CharacterBuildings/application/interfaces';
import { createPostCharacterBuildingController } from '../../../../../src/apps/apiApp/controllers/CharacterBuildings';

jest.mock(
  '../../../../../src/Contexts/apiApp/CharacterBuildings/application/CharacterBuildingCreator'
);

const username = random.word();

describe('PostCharacterBuildingController', () => {
  let service: CharacterBuildingCreator;
  let controller: PostController<
    CharacterBuildingCreator,
    CharacterBuildingCreatorRequest
  >;
  let repository: CharacterBuildingRepositoryMock;
  let userRepository: UserRepositoryMock;
  let SceneRepository: SceneRepository;

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new CharacterBuildingRepositoryMock();
    userRepository = new UserRepositoryMock({ find: true });
    SceneRepository = new SceneRepositoryMock({ find: true });
    service = new CharacterBuildingCreator(
      repository,
      userRepository,
      SceneRepository
    );
    controller = createPostCharacterBuildingController(
      service
    ) as PostController<
      CharacterBuildingCreator,
      CharacterBuildingCreatorRequest
    >;

    req = {
      body: CharacterBuildingCreatorRequestMother.random()
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
    it('should create a character building and send status 201', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(service.run).toHaveBeenCalledWith(req.body, username);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if character building creation fails', async () => {
      const error = new Error('Character building creation failed');
      jest.spyOn(service, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
