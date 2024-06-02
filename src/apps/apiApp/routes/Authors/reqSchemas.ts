import { body, checkExact, param } from 'express-validator';

export const postReqSchema = [
  body('id').exists().isUUID(),
  body('name').exists().isString(),
  checkExact()
];

export const patchReqSchema = [
  param('id').exists().isUUID(),
  body('name').optional().isString(),
  checkExact()
];

export const getReqSchema = [param('id').exists().isUUID(), checkExact()];

export const deleteReqSchema = [param('id').exists().isUUID(), checkExact()];
