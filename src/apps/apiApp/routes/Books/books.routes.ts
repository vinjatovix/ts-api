import { NextFunction, Request, Response, Router } from 'express';
import { DeleteBookController } from '../../controllers/Books/DeleteBookController';
import { GetAllBooksController } from '../../controllers/Books/GetAllBooksController';
import { GetBookController } from '../../controllers/Books/GetBookController';
import { PatchBookController } from '../../controllers/Books/PatchBookController';
import { PostBookController } from '../../controllers/Books/PostBookController';
import container from '../../dependency-injection';
import { API_PREFIXES } from '../shared';
import {
  deleteReqSchema,
  getReqSchema,
  patchReqSchema,
  postReqSchema
} from './reqSchemas';

import { includeAndFilter } from '../shared/middlewares/includeAndFilter';
import {
  auth,
  isAdmin,
  validateBody,
  validateReqSchema
} from '../shared/middlewares';

const prefix = API_PREFIXES.book;

export const register = (router: Router) => {
  const postController = container.get(PostBookController.containerId);
  const getController = container.get(GetBookController.containerId);
  const getAllController = container.get(GetAllBooksController.containerId);
  const patchController = container.get(PatchBookController.containerId);
  const deleteController = container.get(DeleteBookController.containerId);

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
    getReqSchema,
    includeAndFilter,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      getController.run(req, res, next);
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
