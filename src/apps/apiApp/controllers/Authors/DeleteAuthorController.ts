import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../shared/interfaces/Controller';
import { AuthorRemover } from '../../../../Contexts/apiApp/Authors/application';

export class DeleteAuthorController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Authors.DeleteAuthorController';

  constructor(private readonly service: AuthorRemover) {}

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
    return DeleteAuthorController._containerId;
  }
}
