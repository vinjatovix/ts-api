import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { CharacterPatcher } from '../../../../Contexts/apiApp/Characters/application';
import { Controller } from '../../shared/interfaces';

export class PatchCharacterController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Characters.PatchCharacterController';

  constructor(protected service: CharacterPatcher) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;
      const username = res.locals.user.username;

      await this.service.run({ id, ...updates }, username);

      res.status(this.status()).send();
    } catch (error: unknown) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return PatchCharacterController._containerId;
  }
}
