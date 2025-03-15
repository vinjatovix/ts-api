import { body } from 'express-validator';

export const postReqSchema = [
  body('id').exists().isUUID(),
  body('description').exists().isString(),
  body('characters').exists().isArray(),
  body('characters.*').isString()
];
