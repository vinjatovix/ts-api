import { NextFunction, Request, Response, Router } from 'express';
import {
  PostCharacterController,
  GetAllCharactersController,
  GetCharacterController
} from '../../controllers/Characters';
import container from '../../dependency-injection';
import {
  auth,
  isAdmin,
  validateBody,
  validateReqSchema,
  includeAndFilter
} from '../shared/middlewares/';
import { API_PREFIXES } from '../shared';
import { postReqSchema } from './reqSchemas';

const prefix = API_PREFIXES.character;

export const register = (router: Router) => {
  const postController: PostCharacterController = container.get(
    PostCharacterController.containerId
  );

  const getAllController: GetAllCharactersController = container.get(
    GetAllCharactersController.containerId
  );

  const getController: GetCharacterController = container.get(
    GetCharacterController.containerId
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

  router.get(
    `${prefix}`,
    auth,
    includeAndFilter,
    (req: Request, res: Response, next: NextFunction) => {
      getAllController.run(req, res, next);
    }
  );

  router.get(
    `${prefix}/:id`,
    auth,
    includeAndFilter,
    (req: Request, res: Response, next: NextFunction) => {
      getController.run(req, res, next);
    }
  );
};
