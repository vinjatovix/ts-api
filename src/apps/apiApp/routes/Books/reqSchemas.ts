import { body, checkExact, param } from 'express-validator';

const isbnRegex = /^(978|979)-\d{1,5}-\d{1,7}-\d{1,7}-\d$/;

export const postReqSchema = [
  body('id').exists().isUUID(),
  body('title').exists().isString(),
  body('author').exists().isString(),
  body('isbn').exists().matches(isbnRegex),
  body('releaseDate').exists().isISO8601().toDate(),
  body('pages').exists().isInt(),
  checkExact()
];

export const patchReqSchema = [
  param('id').exists().isUUID(),
  body('title').optional().isString(),
  body('author').optional().isString(),
  body('isbn').optional().matches(isbnRegex),
  body('releaseDate').optional().isISO8601().toDate(),
  body('pages').optional().isInt(),
  checkExact()
];

export const getReqSchema = [param('id').exists().isUUID(), checkExact()];
export const deleteReqSchema = [param('id').exists().isUUID(), checkExact()];
