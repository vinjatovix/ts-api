import { NextFunction, Request, Response } from 'express';
import { RefreshToken } from '../../../../Contexts/apiApp/Auth/application/RefreshToken';
import { Controller } from '../../shared/interfaces';
import httpStatus from 'http-status';

export class RefreshTokenController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Auth.RefreshTokenController';

  constructor(protected refreshToken: RefreshToken) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = res.locals.user;

      const newToken = await this.refreshToken.run(token);

      res.status(this.status()).json({ token: newToken });
    } catch (error) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return RefreshTokenController._containerId;
  }
}
