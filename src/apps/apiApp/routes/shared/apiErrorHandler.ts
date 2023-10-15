import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { NotFoundError } from '../../../../Contexts/shared/domain/value-object/NotFoundError';
import { InvalidArgumentError } from '../../../../Contexts/shared/domain/value-object/InvalidArgumentError';

export const apiErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.log(err);

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

  res.status(statusCode).json({ message });
};
