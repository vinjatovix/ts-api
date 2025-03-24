import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { AppError } from '../../../../Contexts/shared/domain/errors/AppErrorFactory';
import { buildLogger } from '../../../../Contexts/shared/plugins';

const logger = buildLogger('apiErrorHandler');

export const apiErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.code;
    message = err.message;
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
