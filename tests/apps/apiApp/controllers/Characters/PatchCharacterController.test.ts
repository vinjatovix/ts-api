import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PatchCharacterController } from '../../../../../src/apps/apiApp/controllers/Characters';
import { CharacterPatcher } from '../../../../../src/Contexts/apiApp/Characters/application';
import { CharacterCreatorRequest } from '../../../../../src/Contexts/apiApp/Characters/application/interfaces';
import { BookRepositoryMock } from '../../../../Contexts/apiApp/Books/__mocks__/BookRepositoryMock';
import { CharacterRepositoryMock } from '../../../../Contexts/apiApp/Characters/__mocks__/CharacterRepositoryMock';
import { CharacterCreatorRequestMother } from '../../../../Contexts/apiApp/Characters/application/mothers';
import { random } from '../../../../Contexts/fixtures/shared';

jest.mock(
  '../../../../../src/Contexts/apiApp/Characters/application/CharacterPatcher'
);

const username = random.word;

describe('PatchCharacterController', () => {
  let service: CharacterPatcher;
  let controller: PatchCharacterController;
  let repository: CharacterRepositoryMock;
  let bookRepository: BookRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let expectedChar: CharacterCreatorRequest;

  beforeEach(() => {
    repository = new CharacterRepositoryMock();
    bookRepository = new BookRepositoryMock();
    service = new CharacterPatcher(repository, bookRepository);
    controller = new PatchCharacterController(service);
    expectedChar = CharacterCreatorRequestMother.random();
    req = { params: { id: expectedChar.id }, body: expectedChar };
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
    it('should update a character and return status 200', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(service.run).toHaveBeenCalledWith(expectedChar, username);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should call next with the error if character update fails', async () => {
      const error = new Error('character update failed');
      jest.spyOn(service, 'run').mockRejectedValueOnce(error);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
