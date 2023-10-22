import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces/Controller';
import { BookCreator } from '../../../../Contexts/apiApp/Books/application/BookCreator';

export abstract class BasePostPutBookController implements Controller {
  constructor(protected bookCreator: BookCreator) {}

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

      res.status(this.status()).send();
    } catch (error: unknown) {
      next(error);
    }
  }

  protected abstract status(): number;
}
