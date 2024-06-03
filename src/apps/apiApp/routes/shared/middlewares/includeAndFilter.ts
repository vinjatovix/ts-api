import { NextFunction, Request, Response } from 'express';
import { transformQsToArray } from '../transformQsToArray';

export const includeAndFilter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.fields = transformQsToArray(req.query.fields as string);
  req.query.include = transformQsToArray(req.query.include as string);

  return next();
};
