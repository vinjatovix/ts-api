import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces/Controller';
import { AuthorCreator } from '../../../../Contexts/apiApp/Authors/application';

export class PostAuthorController implements Controller {
  constructor(protected authorCreator: AuthorCreator) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, name } = req.body;

      await this.authorCreator.run({
        id,
        name
      });

      res.status(this.status()).send();
    } catch (error) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.CREATED;
  }
}
