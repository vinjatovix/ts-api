import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../shared/interfaces/Controller';
import { AuthorFinder } from '../../../../Contexts/apiApp/Authors/application';

export class GetAuthorController implements Controller {
  constructor(private authorFinder: AuthorFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const author = await this.authorFinder.run({ id });

      res.status(httpStatus.OK).send(author);
    } catch (error: unknown) {
      next(error);
    }
  }
}
