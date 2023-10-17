import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../shared/interfaces/Controller';
import { BookCreator } from '../../../../Contexts/apiApp/Books/application/BookCreator';

export class PutBookController implements Controller {
  constructor(private bookCreator: BookCreator) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, title, author, isbn, releaseDate, pages } = req.body;

      await this.bookCreator.run({
        id,
        title,
        author,
        isbn,
        releaseDate,
        pages
      });

      res.status(httpStatus.CREATED).send();
    } catch (error: unknown) {
      next(error);
    }
  }
}
