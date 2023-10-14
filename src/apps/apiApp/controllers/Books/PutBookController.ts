import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../shared/interfaces/Controller';
import { BookCreator } from '../../../../Contexts/apiApp/Books/application/BookCreator';

export class PutBookController implements Controller {
  constructor(private bookCreator: BookCreator) {}

  async run(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { title, author, isbn, releaseDate, pages } = req.body;

    await this.bookCreator.run({ id, title, author, isbn, releaseDate, pages });

    res.status(httpStatus.CREATED).send();
  }
}
