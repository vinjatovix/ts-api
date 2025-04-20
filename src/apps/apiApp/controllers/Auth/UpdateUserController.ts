import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../shared/interfaces';
import { UserPatcher } from '../../../../Contexts/apiApp/Auth/application/UserPatcher';

export class UpdateUserController implements Controller {
  private static readonly _containerId =
    'Apps.apiApp.controllers.Auth.UpdateUserController';

  constructor(protected userPatcher: UserPatcher) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { password, repeatPassword, oldPassword } = req.body;
      const currentUser = res.locals.user;

      await this.userPatcher.run(
        {
          password,
          repeatPassword,
          oldPassword
        },
        currentUser
      );

      res.status(this.status()).json({ message: 'User updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  protected status() {
    return httpStatus.OK;
  }

  public static get containerId() {
    return UpdateUserController._containerId;
  }
}
