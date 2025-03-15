import { NextFunction, Request, Response } from 'express';
import { SceneRemover } from '../../../../Contexts/apiApp/Scenes/application/SceneRemover';
import { Controller } from '../../shared/interfaces';
import httpStatus from 'http-status';

export class DeleteSceneController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Scenes.DeleteSceneController';

  constructor(private readonly service: SceneRemover) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const username = res.locals.user.username;

      await this.service.run({ id }, username);

      res.status(this.status()).send();
    } catch (error: unknown) {
      next(error);
    }
  }

  private status() {
    return httpStatus.NO_CONTENT;
  }

  public static get containerId() {
    return DeleteSceneController._containerId;
  }
}
