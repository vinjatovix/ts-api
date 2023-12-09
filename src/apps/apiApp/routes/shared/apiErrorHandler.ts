import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { NotFoundError } from '../../../../Contexts/shared/domain/errors/NotFoundError';
import { InvalidArgumentError } from '../../../../Contexts/shared/domain/errors/InvalidArgumentError';

import { LogFileSystemRepository } from '../../../../Contexts/shared/Logs/infrastructure/persistence/LogFileSystemRepository';
import { LogFileSystemDataSource } from '../../../../Contexts/shared/Logs/infrastructure/persistence/LogFileSystemDataSource';
import { Log } from '../../../../Contexts/shared/Logs/domain/Log';
import { LogLevel } from '../../../../Contexts/shared/Logs/domain/LogLevel';

export const apiErrorHandler = async (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  let statusCode;
  let message = err.message;
  const logRepository = new LogFileSystemRepository(
    new LogFileSystemDataSource()
  );

  switch (true) {
    case err instanceof NotFoundError:
      statusCode = httpStatus.NOT_FOUND;
      await logRepository.save(new Log(LogLevel.WARN, message));
      break;
    case err instanceof InvalidArgumentError:
      statusCode = httpStatus.BAD_REQUEST;
      await logRepository.save(new Log(LogLevel.WARN, message));
      break;
    default:
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      await logRepository.save(new Log(LogLevel.ERROR, message));
      message = 'Internal Server Error';
  }

  res.status(statusCode).json({ message });
};
