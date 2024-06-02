import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces/Controller';
import { BookCreator } from '../../../../Contexts/apiApp/Books/application';

export class PostBookController implements Controller {
  constructor(protected bookCreator: BookCreator) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, title, author, isbn, releaseDate, pages } = req.body;
      const username = res.locals.user.username;

      await this.bookCreator.run(
        {
          id,
          title,
          author,
          isbn,
          releaseDate,
          pages
        },
        username
      );

      res.status(this.status()).send();
    } catch (error) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.CREATED;
  }
}
