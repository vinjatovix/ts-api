import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { CharacterFinder } from '../../../../Contexts/apiApp/Characters/application';
import { Controller } from '../../shared/interfaces';
import { getOptions } from '../shared/getOptions';

export class GetCharacterController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Characters.GetCharacterController';

  constructor(private readonly service: CharacterFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const options = getOptions(req);
      const data = await this.service.run({ id }, options);

      res.status(this.status()).send(data);
    } catch (error: unknown) {
      next(error);
    }
  }

  private status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return GetCharacterController._containerId;
  }
}
