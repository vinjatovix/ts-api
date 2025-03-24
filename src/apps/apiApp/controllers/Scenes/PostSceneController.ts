import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { SceneCreator } from '../../../../Contexts/apiApp/Scenes/application/SceneCreator';
import { Controller } from '../../shared/interfaces';
import { SceneCreatorRequest } from '../../../../Contexts/apiApp/Scenes/application/interfaces';

export class PostSceneController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Scenes.PostSceneController';

  constructor(protected service: SceneCreator) {}
  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const username = res.locals.user.username;

      await this.service.run(req.body as SceneCreatorRequest, username);
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
