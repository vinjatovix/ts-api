import { body, check, checkExact, param } from 'express-validator';

export const loginReqSchema = [
  body('email').exists().isEmail(),
  body('password').exists().isString(),
  checkExact()
];

export const registerReqSchema = [
  body('email').exists().isEmail(),
  body('username').exists().isString(),
  body('password').exists().isStrongPassword(),
  body('repeatPassword').exists().isStrongPassword(),
  check('repeatPassword', 'Passwords do not match').custom(
    (value: string, { req }) => value === req.body.password
  ),
  checkExact()
];

export const validateMailReqSchema = [
  param('token').exists().isString(),
  checkExact()
];
