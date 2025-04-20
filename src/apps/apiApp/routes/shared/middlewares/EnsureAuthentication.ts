import { NextFunction, Request, Response } from 'express';
import {
  CryptAdapter,
  EncrypterTool
} from '../../../../../Contexts/shared/plugins';
import { createError } from '../../../../../Contexts/shared/domain/errors/AppErrorFactory';

const encrypter: EncrypterTool = new CryptAdapter();
export class EnsureAuthentication {
  static async run(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token: string = req.headers.authorization ?? '';
      if (!token.startsWith('Bearer ')) {
        throw createError.auth('Invalid token');
      }

      const trimmedToken = token.replace('Bearer ', '');

      const userData = await encrypter.verifyToken(trimmedToken);
      if (!userData) {
        throw createError.auth('Invalid token');
      }

      res.locals.user = { ...userData, token: trimmedToken };
      next();
    } catch (error) {
      next(error);
    }
  }

  static isAdministrator(
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const userData = res.locals.user.roles;
    if (!userData.includes('admin')) {
      throw createError.auth('Invalid role');
    }

    return next();
  }
}
