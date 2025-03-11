import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces/Controller';
import { AuthorCreator } from '../../../../Contexts/apiApp/Authors/application';

export class PostAuthorController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Authors.PostAuthorController';

  constructor(protected service: AuthorCreator) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, name } = req.body;
      const username = res.locals.user.username;

      await this.service.run({ id, name }, username);

      res.status(this.status()).send();
    } catch (error) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.CREATED;
  }

  public static get containerId() {
    return PostAuthorController._containerId;
  }
}
