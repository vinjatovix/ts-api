import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces/Controller';
import { CharacterCreator } from '../../../../Contexts/apiApp/Characters/application';

export class PostCharacterController implements Controller {
  constructor(protected characterCreator: CharacterCreator) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, name, book } = req.body;
      const username = res.locals.user.username;

      await this.characterCreator.run(
        {
          id,
          name,
          book
        },
        username
      );

      res.status(this.status()).send();
    } catch (error) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.CREATED;
  }
}
