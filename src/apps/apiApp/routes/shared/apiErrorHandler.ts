import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { NotFoundError } from '../../../../Contexts/shared/domain/errors/NotFoundError';
import { InvalidArgumentError } from '../../../../Contexts/shared/domain/errors/InvalidArgumentError';

import { buildLogger } from '../../../../Contexts/shared/plugins/logger.plugin';

const logger = buildLogger('apiErrorHandler');

export const apiErrorHandler = async (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  let statusCode;
  let message = err.message;

  switch (true) {
    case err instanceof NotFoundError:
      statusCode = httpStatus.NOT_FOUND;

      break;
    case err instanceof InvalidArgumentError:
      statusCode = httpStatus.BAD_REQUEST;

      break;
    default:
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;

      message = 'Internal Server Error';
  }
  logger.error(message);

  res.status(statusCode).json({ message });
};
