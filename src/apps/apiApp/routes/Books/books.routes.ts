import { NextFunction, Request, Response, Router } from 'express';
import { DeleteBookController } from '../../controllers/Books/DeleteBookController';
import { GetAllBooksController } from '../../controllers/Books/GetAllBooksController';
import { GetBookController } from '../../controllers/Books/GetBookController';
import { PatchBookController } from '../../controllers/Books/PatchBookController';
import { PostBookController } from '../../controllers/Books/PostBookController';
import container from '../../dependency-injection';
import {
  API_PREFIXES,
  auth,
  isAdmin,
  validateBody,
  validateReqSchema
} from '../shared';
import {
  deleteReqSchema,
  getReqSchema,
  patchReqSchema,
  postReqSchema
} from './reqSchemas';

import { includeAndFilter } from '../shared/middlewares/includeAndFilter';

const prefix = API_PREFIXES.book;

export const register = (router: Router) => {
  const postController: PostBookController = container.get(
    'Apps.apiApp.controllers.Books.PostBookController'
  );

  const getController: GetBookController = container.get(
    'Apps.apiApp.controllers.Books.GetBookController'
  );

  const getAllController: GetAllBooksController = container.get(
    'Apps.apiApp.controllers.Books.GetAllBooksController'
  );

  const patchController: PatchBookController = container.get(
    'Apps.apiApp.controllers.Books.PatchBookController'
  );

  const deleteController: DeleteBookController = container.get(
    'Apps.apiApp.controllers.Books.DeleteBookController'
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
