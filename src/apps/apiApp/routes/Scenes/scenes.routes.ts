import { NextFunction, Request, Response, Router } from 'express';
import { API_PREFIXES } from '../shared';
import container from '../../dependency-injection';
import { PostSceneController } from '../../controllers/Scenes/PostSceneController';
import {
  auth,
  includeAndFilter,
  isAdmin,
  validateBody,
  validateReqSchema
} from '../shared/middlewares';
import { patchReqSchema, postReqSchema } from './reqSchemas';
import { GetAllScenesController } from '../../controllers/Scenes/GetAllScenesController';
import { GetSceneController } from '../../controllers/Scenes/GetSceneController';
import { PatchSceneController } from '../../controllers/Scenes/PatchSceneController';
import { DeleteSceneController } from '../../controllers/Scenes/DeleteSceneController';

const prefix = API_PREFIXES.scene;

export const register = (router: Router) => {
  const postController = container.get(PostSceneController.containerId);
  const getAllController = container.get(GetAllScenesController.containerId);
  const getController = container.get(GetSceneController.containerId);
  const patchController = container.get(PatchSceneController.containerId);
  const deleteController = container.get(DeleteSceneController.containerId);

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

  router.patch(
    `${prefix}/:id`,
    auth,
    isAdmin,
    validateBody,
    patchReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      patchController.run(req, res, next);
    }
  );

  router.delete(
    `${prefix}/:id`,
    auth,
    isAdmin,
    (req: Request, res: Response, next: NextFunction) => {
      deleteController.run(req, res, next);
    }
  );
};
