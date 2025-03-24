import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookFinder } from '../../../../Contexts/apiApp/Books/application';
import { getOptions } from '../shared/getOptions';
import { Controller, RequestOptions } from '../../shared/interfaces';

export class GetBookController implements Controller {
  constructor(private bookFinder: BookFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const options: Partial<RequestOptions> = getOptions(req);
      const book = await this.bookFinder.run({ id }, options);

      res.status(httpStatus.OK).send(book);
    } catch (error: unknown) {
      next(error);
    }
  }
}
