import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../shared/interfaces/Controller';
import { AuthorRemover } from '../../../../Contexts/apiApp/Authors/application';

export class DeleteAuthorController implements Controller {
  constructor(private authorRemover: AuthorRemover) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.authorRemover.run({ id });

      res.status(httpStatus.NO_CONTENT).send();
    } catch (error: unknown) {
      next(error);
    }
  }
}
