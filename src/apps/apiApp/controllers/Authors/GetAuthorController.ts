import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../shared/interfaces/Controller';
import { AuthorFinder } from '../../../../Contexts/apiApp/Authors/application';

export class GetAuthorController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Authors.GetAuthorController';

  constructor(private readonly service: AuthorFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const author = await this.service.run({ id });

      res.status(this.status()).send(author);
    } catch (error: unknown) {
      next(error);
    }
  }

  private status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return GetAuthorController._containerId;
  }
}
