import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AllCharactersFinder } from '../../../../Contexts/apiApp/Characters/application';
import { Controller } from '../../shared/interfaces';
import { getOptions } from '../shared/getOptions';

export class GetAllCharactersController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Characters.GetAllCharactersController';

  constructor(private readonly service: AllCharactersFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const options = getOptions(req);
      const data = await this.service.run(options);

      res.status(this.status()).send(data);
    } catch (error: unknown) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return GetAllCharactersController._containerId;
  }
}
