import { random } from '../../../../Contexts/fixtures/shared';
import { CharacterFinder } from '../../../../../src/Contexts/apiApp/Characters/application/CharacterFinder';
import { GetCharacterController } from '../../../../../src/apps/apiApp/controllers/Characters/GetCharacterController';
import { CharacterRepositoryMock } from '../../../../Contexts/apiApp/Characters/__mocks__/CharacterRepositoryMock';
import { Request, Response } from 'express';
import { Character } from '../../../../../src/Contexts/apiApp/Characters/domain';
import { CharacterMother } from '../../../../Contexts/apiApp/Characters/domain/mothers';
import httpStatus from 'http-status';

const CHARACTER_ID = random.uuid();

describe('GetCharacterController', () => {
  let controller: GetCharacterController;
  let service: CharacterFinder;
  let repository: CharacterRepositoryMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    repository = new CharacterRepositoryMock();
    service = new CharacterFinder(repository);
    controller = new GetCharacterController(service);
    req = { params: { id: CHARACTER_ID }, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('run', () => {
    it('should get a character and sen 200 status', async () => {
      const character: Character = CharacterMother.random();
      jest
        .spyOn(service, 'run')
        .mockResolvedValueOnce(character.toPrimitives());

      await controller.run(req as Request, res as Response, next);

      expect(service.run).toHaveBeenCalledWith({ id: CHARACTER_ID }, {});
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(character.toPrimitives());
    });
  });

  it('should call next with the error if character retrieval fails', async () => {
    const error = new Error('Character retrieval failed');
    jest.spyOn(service, 'run').mockRejectedValueOnce(error);

    await controller.run(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should pass the qs to the service', async () => {
    const character: Character = CharacterMother.random();
    const options = { include: ['book'], fields: ['book', 'name'] };
    req.query = options;
    jest.spyOn(service, 'run').mockResolvedValueOnce(character.toPrimitives());

    await controller.run(req as Request, res as Response, next);

    expect(service.run).toHaveBeenCalledWith({ id: CHARACTER_ID }, options);
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.send).toHaveBeenCalledWith(character.toPrimitives());
  });
});
