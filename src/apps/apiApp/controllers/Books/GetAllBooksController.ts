import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AllBooksFinder } from '../../../../Contexts/apiApp/Books/application';
import { Controller, RequestOptions } from '../../shared/interfaces';
import { getOptions } from '../shared/getOptions';

export class GetAllBooksController implements Controller {
  constructor(private allBooksFinder: AllBooksFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const options: Partial<RequestOptions> = getOptions(req);
      const books = await this.allBooksFinder.run(options);

      res.status(httpStatus.OK).send(books);
    } catch (error: unknown) {
      next(error);
    }
  }
}
