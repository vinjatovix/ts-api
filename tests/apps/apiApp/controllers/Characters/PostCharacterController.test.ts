import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CharacterCreator } from '../../../../../src/Contexts/apiApp/Characters/application';
import { CharacterCreatorRequest } from '../../../../../src/Contexts/apiApp/Characters/application/interfaces';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock';
import { CharacterRepositoryMock } from '../../../../Contexts/apiApp/Characters/__mocks__/CharacterRepositoryMock';
import { CharacterNameMother } from '../../../../Contexts/apiApp/Characters/domain/mothers';
import { UuidMother } from '../../../../Contexts/fixtures/shared/domain/mothers';
import { random } from '../../../../Contexts/fixtures/shared';
import { PostController } from '../../../../../src/apps/apiApp/controllers/shared/PostController';
import { createPostCharacterController } from '../../../../../src/apps/apiApp/controllers/Characters';

jest.mock(
  '../../../../../src/Contexts/apiApp/Characters/application/CharacterCreator'
);

const username = random.word();

describe('PostCharacterController', () => {
  let characterCreator: CharacterCreator;
  let controller: PostController<CharacterCreator, CharacterCreatorRequest>;
  let repository: CharacterRepositoryMock;
  let bookRepository: BookRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedCharacter: CharacterCreatorRequest;

  beforeEach(() => {
    repository = new CharacterRepositoryMock();
    bookRepository = new BookRepositoryMock({ find: true });
    characterCreator = new CharacterCreator(repository, bookRepository);
    controller = createPostCharacterController(
      characterCreator
    ) as PostController<CharacterCreator, CharacterCreatorRequest>;
    expectedCharacter = {
      id: UuidMother.random().value,
      name: CharacterNameMother.random().value,
      book: UuidMother.random().value
    };
    req = {
      body: expectedCharacter
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
    it('should create a character and send 201 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(characterCreator.run).toHaveBeenCalledWith(
        expectedCharacter,
        username
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith();
    });
  });

  it('should call next with the error ir character creation fails', async () => {
    const error = new Error('Character creation failed');
    jest.spyOn(characterCreator, 'run').mockRejectedValueOnce(error);

    await controller.run(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
