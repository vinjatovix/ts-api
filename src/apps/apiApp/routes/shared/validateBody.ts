import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { buildLogger } from '../../../../Contexts/shared/plugins/logger.plugin';

const logger = buildLogger('validateReqSchema');

export const validateBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length) {
    return next();
  }

  logger.error(`${req.method} ${req.path} - Empty body`);
  return res.status(httpStatus.BAD_REQUEST).json({
    errors: [{ message: 'Empty body is not allowed' }]
  });
};
