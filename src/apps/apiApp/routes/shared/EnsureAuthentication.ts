import { NextFunction, Request, Response } from 'express';
import { EncrypterTool } from '../../../../Contexts/shared/plugins/EncrypterTool';
import { CryptAdapter } from '../../../../Contexts/shared/plugins/CryptAdapter';
import { AuthError } from '../../../../Contexts/shared/domain/errors/AuthError';

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
        throw new AuthError('Invalid token');
      }

      const userData = await encrypter.verifyToken(token.split(' ')[1]);
      if (!userData) {
        throw new AuthError('Invalid token');
      }

      res.locals.user = userData;
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
      throw new AuthError('Invalid role');
    }

    return next();
  }
}
