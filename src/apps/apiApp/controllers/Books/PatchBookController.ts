import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookPatcher } from '../../../../Contexts/apiApp/Books/application';
import { Controller } from '../../shared/interfaces/Controller';

export class PatchBookController implements Controller {
  constructor(protected bookPatcher: BookPatcher) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      await this.bookPatcher.run({
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
