import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookFinder } from '../../../../Contexts/apiApp/Books/application';
import { getOptions } from '../shared/getOptions';
import { Controller, RequestOptions } from '../../shared/interfaces';

export class GetBookController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Books.GetBookController';

  constructor(private readonly service: BookFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const options: Partial<RequestOptions> = getOptions(req);
      const book = await this.service.run({ id }, options);

      res.status(this.status()).send(book);
    } catch (error: unknown) {
      next(error);
    }
  }

  private status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return GetBookController._containerId;
  }
}
