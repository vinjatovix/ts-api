import { NextFunction, Request, Response, Router } from 'express';
import container from '../../dependency-injection';
import { API_PREFIXES } from '../shared';
import {
  DeleteAuthorController,
  GetAllAuthorsController,
  GetAuthorController,
  PatchAuthorController,
  PostAuthorController
} from '../../controllers/Authors';
import {
  auth,
  isAdmin,
  validateBody,
  validateReqSchema
} from '../shared/middlewares';
import {
  deleteReqSchema,
  getReqSchema,
  patchReqSchema,
  postReqSchema
} from './reqSchemas';

const prefix = API_PREFIXES.author;

export const register = (router: Router) => {
  const postController = container.get(PostAuthorController.containerId);
  const getController = container.get(GetAuthorController.containerId);
  const getAllController = container.get(GetAllAuthorsController.containerId);
  const patchController = container.get(PatchAuthorController.containerId);
  const deleteController = container.get(DeleteAuthorController.containerId);

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
    validateReqSchema,
    deleteReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      deleteController.run(req, res, next);
    }
  );

  router.get(
    `${prefix}`,
    auth,
    (req: Request, res: Response, next: NextFunction) => {
      getAllController.run(req, res, next);
    }
  );

  router.get(
    `${prefix}/:id`,
    auth,
    getReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      getController.run(req, res, next);
    }
  );
};
