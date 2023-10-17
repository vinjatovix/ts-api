import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../shared/interfaces/Controller';
import { BookRemover } from '../../../../Contexts/apiApp/Books/application/BookRemover';
export class DeleteBookController implements Controller {
  constructor(private bookDeleter: BookRemover) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.bookDeleter.run({ id });

      res.status(httpStatus.NO_CONTENT).send();
    } catch (error: unknown) {
      next(error);
    }
  }
}
