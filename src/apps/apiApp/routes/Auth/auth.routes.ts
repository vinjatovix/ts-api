import { NextFunction, Request, Response, Router } from 'express';
import {
  LoginController,
  RegisterController,
  ValidateMailController
} from '../../controllers/Auth';
import container from '../../dependency-injection';
import { API_PREFIXES } from '../shared';
import { validateBody, validateReqSchema } from '../shared/middlewares';
import {
  loginReqSchema,
  registerReqSchema,
  validateMailReqSchema
} from './reqSchemas';

const prefix = API_PREFIXES.auth;

export const register = (router: Router) => {
  const loginController = container.get(LoginController.containerId);
  const registerController = container.get(RegisterController.containerId);
  const validateMailController = container.get(
    ValidateMailController.containerId
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
