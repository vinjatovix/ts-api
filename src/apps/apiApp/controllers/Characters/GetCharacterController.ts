import { NextFunction, Request, Response } from 'express';
import { Controller, RequestOptions } from '../../shared/interfaces';
import httpStatus from 'http-status';
import { getOptions } from '../shared/getOptions';
import { CharacterFinder } from '../../../../Contexts/apiApp/Characters/application/CharacterFinder';
import { CharacterPrimitives } from '../../../../Contexts/apiApp/Characters/domain/interfaces/CharacterPrimitives';

export class GetCharacterController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Characters.GetCharacterController';

  constructor(private readonly service: CharacterFinder) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const options: Partial<RequestOptions> = getOptions(req);
      const data: CharacterPrimitives = await this.service.run({ id }, options);

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
