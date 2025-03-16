import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookRemover } from '../../../../Contexts/apiApp/Books/application';
import { Controller } from '../../shared/interfaces';

export class DeleteBookController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Books.DeleteBookController';

  constructor(private readonly service: BookRemover) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const username = res.locals.user.username;

      await this.service.run({ id }, username);

      res.status(this.status()).send();
    } catch (error: unknown) {
      next(error);
    }
  }

  private status() {
    return httpStatus.NO_CONTENT;
  }

  public static get containerId() {
    return DeleteBookController._containerId;
  }
}
