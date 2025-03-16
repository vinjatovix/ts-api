import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { SceneCreator } from '../../../../Contexts/apiApp/Scenes/application';
import { Controller } from '../../shared/interfaces';

export class PostSceneController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Scenes.PostSceneController';

  constructor(protected service: SceneCreator) {}
  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const username = res.locals.user.username;

      await this.service.run(req.body, username);

      res.status(this.status()).send();
    } catch (error) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.CREATED;
  }

  public static get containerId() {
    return PostSceneController._containerId;
  }
}
