import { NextFunction, Request, Response } from 'express';
import { InvalidArgumentError } from '../../../../Contexts/shared/domain/errors/InvalidArgumentError';

export const validateBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length) {
    return next();
  }

  throw new InvalidArgumentError('Empty body is not allowed');
};
