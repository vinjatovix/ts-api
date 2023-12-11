import { NextFunction, Request, Response } from 'express';
import { AllBooksFinder } from '../../../../Contexts/apiApp/Books/application';
import { Controller } from '../../shared/interfaces/Controller';
import httpStatus from 'http-status';

export class GetAllBooksController implements Controller {
  constructor(private allBooksFinder: AllBooksFinder) {}

  async run(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const books = await this.allBooksFinder.run();

      res.status(httpStatus.OK).send(books);
    } catch (error: unknown) {
      next(error);
    }
  }
}
