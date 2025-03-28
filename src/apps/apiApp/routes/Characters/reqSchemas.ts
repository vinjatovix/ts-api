import { body, checkExact, param } from 'express-validator';

export const postReqSchema = [
  body('id').exists().isUUID(),
  body('name').exists().isString(),
  body('book').exists().isUUID()
];

export const patchReqSchema = [
  param('id').exists().isUUID(),
  body('name').optional().isString(),
  body('book').optional().isUUID()
];

export const deleteReqSchema = [param('id').exists().isUUID(), checkExact()];
