import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces/Controller';
import { RegisterUser } from '../../../../Contexts/apiApp/Auth/application';

export class RegisterController implements Controller {
  constructor(protected register: RegisterUser) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, username, password } = req.body;
      await this.register.run({ email, username, password });

      res.status(this.status()).send();
    } catch (error) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.CREATED;
  }
}
