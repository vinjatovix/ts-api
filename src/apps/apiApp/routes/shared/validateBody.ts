import { NextFunction, Request, Response } from 'express';
import { createError } from '../../../../Contexts/shared/domain/errors/AppErrorFactory';

export const validateBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length) {
    return next();
  }

  throw createError.invalidArgument('Empty body is not allowed');
};
