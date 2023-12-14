import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { UserRepositoryMock } from '../../../../Contexts/apiApp/Auth/__mocks__/UserRepositoryMock';
import { ValidateMailController } from '../../../../../src/apps/apiApp/controllers/Auth';
import { ValidateMail } from '../../../../../src/Contexts/apiApp/Auth/application';
import { CryptAdapterMock } from '../../../../Contexts/apiApp/Auth/__mocks__/CryptAdapterMock';
import { AuthError } from '../../../../../src/Contexts/shared/domain/errors/AuthError';

describe('ValidateMailController', () => {
  let repository: UserRepositoryMock;
  let encrypter: CryptAdapterMock;
  let controller: ValidateMailController;
  let service: ValidateMail;
  let request: { token: string };

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  const spyService = jest.spyOn(ValidateMail.prototype, 'run');

  beforeEach(() => {
    repository = new UserRepositoryMock({ exists: true });
    encrypter = new CryptAdapterMock({ login: true, token: true });
    service = new ValidateMail(repository, encrypter);
    controller = new ValidateMailController(service);
    request = { token: 'token' };
    req = { params: request };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  describe('run', () => {
    it('should validate the mail and send 200 status', async () => {
      await controller.run(req as Request, res as Response, next);

      expect(spyService).toHaveBeenCalledWith(request);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });
    });

    it('should call next with the AuthError if login fails', async () => {
      encrypter = new CryptAdapterMock({ login: false });
      service = new ValidateMail(repository, encrypter);
      controller = new ValidateMailController(service);

      await controller.run(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AuthError));
    });
  });
});
