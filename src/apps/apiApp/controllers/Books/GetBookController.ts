import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../shared/interfaces/Controller';
import { BookFinder } from '../../../../Contexts/apiApp/Books/application/BookFinder';

export class GetBookController implements Controller {
  constructor(private bookFinder: BookFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const book = await this.bookFinder.run({ id });

      res.status(httpStatus.OK).send(book);
    } catch (error: unknown) {
      next(error);
    }
  }
}
