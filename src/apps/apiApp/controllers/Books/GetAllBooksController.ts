import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AllBooksFinder } from '../../../../Contexts/apiApp/Books/application';
import { Controller, RequestOptions } from '../../shared/interfaces';
import { getOptions } from '../shared/getOptions';

export class GetAllBooksController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Books.GetAllBooksController';

  constructor(private readonly service: AllBooksFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const options: Partial<RequestOptions> = getOptions(req);
      const books = await this.service.run(options);

      res.status(this.status()).send(books);
    } catch (error: unknown) {
      next(error);
    }
  }

  private status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return GetAllBooksController._containerId;
  }
}
