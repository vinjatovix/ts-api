import { body } from 'express-validator';

export const postReqSchema = [
  body('id').exists().isUUID(),
  body('description').exists().isString(),
  body('characters').exists().isArray(),
  body('characters.*').isString()
];

export const patchReqSchema = [
  body('description').optional().isString(),
  body('characters').optional().isArray(),
  body('characters.*').isString()
];
