import httpStatus from 'http-status';

export class AppError extends Error {
  readonly code: number;

  constructor(name: string, message: string, code: number) {
    super(message);
    this.name = name;
    this.code = code;
  }
}

export const createError = {
  auth: (message: string) =>
    new AppError('AuthError', message, httpStatus.UNAUTHORIZED),
  conflict: (message: string) =>
    new AppError('ConflictError', message, httpStatus.CONFLICT),
  invalidArgument: (message: string) =>
    new AppError('InvalidArgumentError', message, httpStatus.BAD_REQUEST),
  notFound: (message: string) =>
    new AppError('NotFoundError', `${message} not found.`, httpStatus.NOT_FOUND)
};
