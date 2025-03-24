import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { LoginController } from '../../../../../src/apps/apiApp/controllers/Auth';
import { LoginUser } from '../../../../../src/Contexts/apiApp/Auth/application';
import { LoginUserRequest } from '../../../../../src/Contexts/apiApp/Auth/application/interfaces';
import { UserRepositoryMock } from '../../../../Contexts/apiApp/Auth/__mocks__/UserRepositoryMock';
import { CryptAdapterMock } from '../../../../Contexts/apiApp/Auth/__mocks__/CryptAdapterMock';
import { LoginUserRequestMother } from '../../../../Contexts/apiApp/Auth/application/mothers/LoginUserRequestMother';

describe('LoginController', () => {
  let repository: UserRepositoryMock;
  let encrypter: CryptAdapterMock;
  let controller: LoginController;
  let service: LoginUser;
  let request: LoginUserRequest;

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  const spyService = jest.spyOn(LoginUser.prototype, 'run');

  beforeEach(() => {
    repository = new UserRepositoryMock({ exists: true });
    encrypter = new CryptAdapterMock({ login: true, token: true });
    service = new LoginUser(repository, encrypter);
    controller = new LoginController(service);
    request = LoginUserRequestMother.random();
    req = { body: request };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  describe('run', () => {
    it('should login the user and send 200 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(spyService).toHaveBeenCalledWith(request);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });
    });

    it('should call next with the AuthError if login fails', async () => {
      encrypter = new CryptAdapterMock({ login: false });
      service = new LoginUser(repository, encrypter);
      controller = new LoginController(service);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'AuthError' })
      );
    });
  });
});
