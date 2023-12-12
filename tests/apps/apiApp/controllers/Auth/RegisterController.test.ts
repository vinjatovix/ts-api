import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { RegisterUser } from '../../../../../src/Contexts/apiApp/Auth/application';
import { RegisterUserRequest } from '../../../../../src/Contexts/apiApp/Auth/application/RegisterUserRequest';
import { RegisterController } from '../../../../../src/apps/apiApp/controllers/Auth';
import { CryptAdapterMock } from '../../../../Contexts/apiApp/Auth/__mocks__/CryptAdapterMock';
import { UserRepositoryMock } from '../../../../Contexts/apiApp/Auth/__mocks__/UserRepositoryMock';
import { RegisterUserRequestMother } from '../../../../Contexts/apiApp/Auth/application/mothers/RegisterUserRequestMother';
import { InvalidArgumentError } from '../../../../../src/Contexts/shared/domain/errors/InvalidArgumentError';

describe('RegisterController', () => {
  let repository: UserRepositoryMock;
  let encrypter: CryptAdapterMock;
  let controller: RegisterController;
  let service: RegisterUser;
  let request: RegisterUserRequest;

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  const spyService = jest.spyOn(RegisterUser.prototype, 'run');

  beforeEach(() => {
    repository = new UserRepositoryMock({ exists: false });
    encrypter = new CryptAdapterMock({ token: true });
    service = new RegisterUser(repository, encrypter);
    controller = new RegisterController(service);
    request = RegisterUserRequestMother.random();
    req = { body: { ...request, repeatPassword: request.password } };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  describe('run', () => {
    it('should register the user and send 201 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(spyService).toHaveBeenCalledWith(request);
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith();
    });

    it("should fail if passwords don't match", async () => {
      req = { body: { ...request, repeatPassword: 'differentPassword' } };

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(InvalidArgumentError));
    });

    it('should fail if user exists', async () => {
      repository = new UserRepositoryMock({ exists: true });
      service = new RegisterUser(repository, encrypter);
      controller = new RegisterController(service);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(InvalidArgumentError));
    });
  });
});
