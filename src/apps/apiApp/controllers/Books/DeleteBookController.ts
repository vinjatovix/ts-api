import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookRemover } from '../../../../Contexts/apiApp/Books/application';
import { Controller } from '../../shared/interfaces/Controller';

export class DeleteBookController implements Controller {
  constructor(private bookDeleter: BookRemover) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const username = res.locals.user.username;

      await this.bookDeleter.run({ id }, username);

      res.status(httpStatus.NO_CONTENT).send();
    } catch (error: unknown) {
      next(error);
    }
  }
}
