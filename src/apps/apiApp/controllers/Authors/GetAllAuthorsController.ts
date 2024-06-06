import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AllAuthorsFinder } from '../../../../Contexts/apiApp/Authors/application';
import { Controller } from '../../shared/interfaces/Controller';

export class GetAllAuthorsController implements Controller {
  constructor(private allAuthorsFinder: AllAuthorsFinder) {}

  async run(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authors = await this.allAuthorsFinder.run();

      res.status(httpStatus.OK).send(authors);
    } catch (error: unknown) {
      next(error);
    }
  }
}
