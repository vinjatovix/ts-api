import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AllCharactersFinder } from '../../../../../src/Contexts/apiApp/Characters/application';
import { Character } from '../../../../../src/Contexts/apiApp/Characters/domain';
import { CharacterRepositoryMock } from '../../../../Contexts/apiApp/Characters/__mocks__/CharacterRepositoryMock';
import { CharacterMother } from '../../../../Contexts/apiApp/Characters/domain/mothers';
import { GetAllController } from '../../../../../src/apps/apiApp/controllers/shared/GetAllController';
import { RequestOptions } from '../../../../../src/apps/apiApp/shared/interfaces';
import { CharacterPrimitives } from '../../../../../src/Contexts/apiApp/Characters/domain/interfaces';
import { createGetAllCharactersController } from '../../../../../src/apps/apiApp/controllers/Characters';

describe('GetAllCharactersController', () => {
  let repository: CharacterRepositoryMock;
  let finder: AllCharactersFinder;
  let controller: GetAllController<
    AllCharactersFinder,
    Partial<RequestOptions>,
    CharacterPrimitives[]
  >;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new CharacterRepositoryMock();
    finder = new AllCharactersFinder(repository);
    controller = createGetAllCharactersController(finder) as GetAllController<
      AllCharactersFinder,
      Partial<RequestOptions>,
      CharacterPrimitives[]
    >;
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('run', () => {
    it('should get all characters and send 200 status', async () => {
      const characters: Character[] = CharacterMother.randomList(3);
      jest
        .spyOn(finder, 'run')
        .mockResolvedValueOnce(characters.map((c) => c.toPrimitives()));

      await controller.run(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(
        characters.map((c) => c.toPrimitives())
      );
    });
  });
});
