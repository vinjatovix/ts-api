import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookPatcher } from '../../../../Contexts/apiApp/Books/application';
import { Controller } from '../../shared/interfaces/Controller';

export class PatchBookController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Books.PatchBookController';

  constructor(protected service: BookPatcher) {}
  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;
      const username = res.locals.user.username;

      await this.service.run({ id, ...updates }, username);

      res.status(this.status()).send();
    } catch (error: unknown) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return PatchBookController._containerId;
  }
}
