import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthorPatcher } from '../../../../Contexts/apiApp/Authors/application';
import { Controller } from '../../shared/interfaces/Controller';

export class PatchAuthorController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Authors.PatchAuthorController';

  constructor(protected service: AuthorPatcher) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const payload = req.body;
      const username = res.locals.user.username;

      await this.service.run({ id, ...payload }, username);

      res.status(this.status()).send();
    } catch (error: unknown) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return PatchAuthorController._containerId;
  }
}
