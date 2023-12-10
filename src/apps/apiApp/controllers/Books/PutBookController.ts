import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces/Controller';
import { BookUpdater } from '../../../../Contexts/apiApp/Books/application/BookUpdater';

export class PutBookController implements Controller {
  constructor(protected bookUpdater: BookUpdater) {}
  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { title, author, isbn, releaseDate, pages } = req.body;

      await this.bookUpdater.run({
        id,
        title,
        author,
        isbn,
        releaseDate,
        pages
      });

      res.status(this.status()).send();
    } catch (error: unknown) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.OK;
  }
}
