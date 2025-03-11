import { NextFunction, Request, Response, Router } from 'express';
import {
  DeleteCharacterController,
  GetAllCharactersController,
  GetCharacterController,
  PatchCharacterController,
  PostCharacterController
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
import { postReqSchema, patchReqSchema, deleteReqSchema } from './reqSchemas';

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

  const patchController: PatchCharacterController = container.get(
    PatchCharacterController.containerId
  );

  const deleteController: DeleteCharacterController = container.get(
    DeleteCharacterController.containerId
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
    deleteReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      deleteController.run(req, res, next);
    }
  );
};
