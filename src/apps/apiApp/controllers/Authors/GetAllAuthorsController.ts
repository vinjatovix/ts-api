import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AllAuthorsFinder } from '../../../../Contexts/apiApp/Authors/application';
import { Controller } from '../../shared/interfaces/Controller';

export class GetAllAuthorsController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Authors.GetAllAuthorsController';

  constructor(private readonly service: AllAuthorsFinder) {}

  async run(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.run();

      res.status(this.status()).send(data);
    } catch (error: unknown) {
      next(error);
    }
  }

  private status() {
    return httpStatus.OK;
  }
  public static get containerId() {
    return GetAllAuthorsController._containerId;
  }
}
