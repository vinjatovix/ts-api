import { body } from 'express-validator';

export const postReqSchema = [
  body('id').exists().isUUID(),
  body('name').exists().isString(),
  body('book').exists().isUUID()
];
