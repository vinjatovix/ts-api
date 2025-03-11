import { MongoServerError } from 'mongodb';
import { MONGO_ERROR_CODES } from './mongoErrorCodes';
import { createError } from '../../../domain/errors';

export class MongoErrorHandler {
  static formatError(err: MongoServerError): void {
    if (err.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
      const mongoError = err;
      const keys = JSON.stringify(mongoError.errorResponse.keyValue);

      throw createError.invalidArgument(`Duplicate document with ${keys}`);
    }

    if (err.code === MONGO_ERROR_CODES.PATH_COLLISION) {
      throw createError.invalidArgument(err.errmsg || err.message);
    }
  }
}
