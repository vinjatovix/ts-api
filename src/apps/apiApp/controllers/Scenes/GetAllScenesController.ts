import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AllScenesFinder } from '../../../../Contexts/apiApp/Scenes/application';
import { Controller } from '../../shared/interfaces';
import { getOptions } from '../shared/getOptions';

export class GetAllScenesController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Scenes.GetAllScenesController';

  constructor(private readonly service: AllScenesFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const options = getOptions(req);
      const scenes = await this.service.run(options);

      res.status(this.status()).send(scenes);
    } catch (error: unknown) {
      next(error);
    }
  }

  private status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return GetAllScenesController._containerId;
  }
}
