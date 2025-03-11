import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces/Controller';
import { ValidateMail } from '../../../../Contexts/apiApp/Auth/application';

export class ValidateMailController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Auth.ValidateMailController';

  constructor(protected validateMail: ValidateMail) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.params;

      const newToken = await this.validateMail.run({ token });

      res.status(this.status()).json({ token: newToken });
    } catch (error) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return ValidateMailController._containerId;
  }
}
