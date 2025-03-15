import { NextFunction, Request, Response } from 'express';
import { SceneFinder } from '../../../../Contexts/apiApp/Scenes/application/SceneFinder';
import { Controller, RequestOptions } from '../../shared/interfaces';
import httpStatus from 'http-status';
import { getOptions } from '../shared/getOptions';

export class GetSceneController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Scenes.GetSceneController';

  constructor(private readonly service: SceneFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const options: Partial<RequestOptions> = getOptions(req);
      const scene = await this.service.run({ id }, options);

      res.status(this.status()).send(scene);
    } catch (error: unknown) {
      next(error);
    }
  }

  private status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return GetSceneController._containerId;
  }
}
