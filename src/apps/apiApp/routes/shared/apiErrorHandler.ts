import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { NotFoundError } from '../../../../Contexts/shared/domain/errors/NotFoundError';
import { InvalidArgumentError } from '../../../../Contexts/shared/domain/errors/InvalidArgumentError';

import { buildLogger } from '../../../../Contexts/shared/plugins/logger.plugin';
import { AuthError } from '../../../../Contexts/shared/domain/errors/AuthError';

const logger = buildLogger('apiErrorHandler');

export const apiErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode;
  let message = err.message;

  // TODO: to avoid case explosion, we could use an custom error Factory, GH issue #121
  switch (true) {
    case err instanceof AuthError:
      statusCode = httpStatus.UNAUTHORIZED;
      break;
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

  const stack =
    statusCode === httpStatus.INTERNAL_SERVER_ERROR
      ? `- Stack: ${err.stack}`
      : '';

  const url = _req.originalUrl;
  const method = _req.method;
  const usernameMessage = res.locals.user
    ? `User: ${res.locals.user.username} -`
    : 'User: anonymous -';

  logger.error(
    `${_req.ip} - ${usernameMessage} ${method} ${url} - Error: ${statusCode} ${err.message} ${stack}`
  );
  res.status(statusCode).json({ message });
};
