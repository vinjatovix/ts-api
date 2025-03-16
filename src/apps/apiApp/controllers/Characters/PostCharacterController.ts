import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { CharacterCreator } from '../../../../Contexts/apiApp/Characters/application';
import { Controller } from '../../shared/interfaces';

export class PostCharacterController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Characters.PostCharacterController';

  constructor(protected service: CharacterCreator) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, name, book } = req.body;
      const username = res.locals.user.username;

      await this.service.run({ id, name, book }, username);

      res.status(this.status()).send();
    } catch (error) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.CREATED;
  }

  public static get containerId() {
    return PostCharacterController._containerId;
  }
}
