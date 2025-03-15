import { NextFunction, Request, Response, Router } from 'express';
import { API_PREFIXES } from '../shared';
import container from '../../dependency-injection';
import { PostSceneController } from '../../controllers/Scenes/PostSceneController';
import {
  auth,
  isAdmin,
  validateBody,
  validateReqSchema
} from '../shared/middlewares';
import { postReqSchema } from './postReqSchema';

const prefix = API_PREFIXES.scene;

export const register = (router: Router) => {
  const postController = container.get(PostSceneController.containerId);

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
