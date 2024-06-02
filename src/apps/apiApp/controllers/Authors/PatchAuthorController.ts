import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthorPatcher } from '../../../../Contexts/apiApp/Authors/application';
import { Controller } from '../../shared/interfaces/Controller';

export class PatchAuthorController implements Controller {
  constructor(protected authorPatcher: AuthorPatcher) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      await this.authorPatcher.run({
        id,
        ...updates
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
