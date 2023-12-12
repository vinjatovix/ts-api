import { NextFunction, Request, Response, Router } from 'express';
import { body, checkExact, param } from 'express-validator';

import container from '../../dependency-injection';

import { validateBody, validateReqSchema } from '../shared';
import {
  LoginController,
  RegisterController,
  ValidateMailController
} from '../../controllers/Auth';

const prefix = '/api/v1/Auth';

export const register = (router: Router) => {
  const loginReqSchema = [
    body('email').exists().isEmail(),
    body('password').exists().isString(),
    checkExact()
  ];

  const registerReqSchema = [
    body('email').exists().isEmail(),
    body('username').exists().isString(),
    // body('password').exists().isStrongPassword(),
    // body('repeatPassword').exists().isStrongPassword(),
    body('password').exists().isString(),
    body('repeatPassword').exists().isString(),
    checkExact()
  ];

  const validateMailReqSchema = [
    param('token').exists().isString(),
    checkExact()
  ];

  const loginController: LoginController = container.get(
    'Apps.apiApp.controllers.Auth.LoginController'
  );

  const registerController: RegisterController = container.get(
    'Apps.apiApp.controllers.Auth.RegisterController'
  );

  const validateMailController: ValidateMailController = container.get(
    'Apps.apiApp.controllers.Auth.ValidateMailController'
  );

  router.post(
    `${prefix}/login`,
    validateBody,
    loginReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      loginController.run(req, res, next);
    }
  );

  router.post(
    `${prefix}/register`,
    validateBody,
    registerReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      registerController.run(req, res, next);
    }
  );

  router.get(
    `${prefix}/validate/:token`,
    validateMailReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      validateMailController.run(req, res, next);
    }
  );
};
