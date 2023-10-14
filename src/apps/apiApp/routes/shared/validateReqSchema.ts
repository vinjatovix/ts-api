import { NextFunction, Request, Response } from 'express';
import {
  FieldValidationError,
  UnknownFieldsError,
  ValidationError,
  validationResult
} from 'express-validator';
import httpStatus from 'http-status';

export const validateReqSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    return next();
  }

  interface ValidationErrorInfo {
    [key: string]: string;
  }

  const extractFieldErrorInfo = (
    error: FieldValidationError
  ): ValidationErrorInfo | null => {
    const errorInfoKey = error.path;
    const errorInfoValue = `${error.msg} at ${error.location}. Value: ${error.value}`;
    return { [errorInfoKey]: errorInfoValue };
  };

  const extractUnknownFieldsErrorInfo = (
    error: UnknownFieldsError
  ): ValidationErrorInfo => {
    const fields = error.fields.map(
      (field) =>
        `Unknown field <${field.path}> in <${field.location}> with value <${field.value}>`
    );
    const errorInfoValue = fields.join(',');
    return { fields: errorInfoValue };
  };

  const extractGenericErrorInfo = (
    error: ValidationError
  ): ValidationErrorInfo => {
    const errorMessage = error.msg || 'Unknown error';
    return { message: errorMessage };
  };

  const errors: ValidationErrorInfo[] = validationErrors
    .array()
    .reduce((acc: ValidationErrorInfo[], error: ValidationError) => {
      let errorInfo: ValidationErrorInfo | null = null;

      switch (error.type) {
        case 'field':
          errorInfo = extractFieldErrorInfo(error);
          break;

        case 'unknown_fields':
          errorInfo = extractUnknownFieldsErrorInfo(error);
          break;

        default:
          errorInfo = extractGenericErrorInfo(error);
          break;
      }

      if (
        errorInfo !== null &&
        !acc.some((item) => JSON.stringify(item) === JSON.stringify(errorInfo))
      ) {
        acc.push(errorInfo);
      }

      return acc;
    }, []);

  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
    errors
  });
};
