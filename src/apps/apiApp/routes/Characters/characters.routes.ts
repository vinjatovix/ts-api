import { NextFunction, Request, Response, Router } from 'express';
import { PostCharacterController } from '../../controllers/Characters';
import container from '../../dependency-injection';
import {
  auth,
  isAdmin,
  validateBody,
  validateReqSchema
} from '../shared/middlewares';
import { API_PREFIXES } from '../shared';
import { postReqSchema } from './reqSchemas';

const prefix = API_PREFIXES.character;

export const register = (router: Router) => {
  const postController: PostCharacterController = container.get(
    PostCharacterController.containerId
  );

  router.post(
    `${prefix}/`,
    auth,
    isAdmin,
    validateBody,
    postReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      postController.run(req, res, next);
    }
  );
};
