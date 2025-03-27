import { NextFunction, Request, Response, Router } from 'express';
import {
  LoginController,
  RefreshTokenController,
  RegisterController,
  ValidateMailController
} from '../../controllers/Auth';
import container from '../../dependency-injection';
import { API_PREFIXES } from '../shared';
import { auth, validateBody, validateReqSchema } from '../shared/middlewares';
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
  const refreshTokenController = container.get(
    RefreshTokenController.containerId
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

  router.get(
    `${prefix}/refresh`,
    auth,
    (req: Request, res: Response, next: NextFunction) => {
      refreshTokenController.run(req, res, next);
    }
  );
};
