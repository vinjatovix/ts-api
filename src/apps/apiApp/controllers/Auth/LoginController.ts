import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces/Controller';
import { LoginUser } from '../../../../Contexts/apiApp/Auth/application';

export class LoginController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Auth.LoginController';

  constructor(protected login: LoginUser) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const token = await this.login.run({ email, password });

      res.status(this.status()).json({ token });
    } catch (error) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return LoginController._containerId;
  }
}
