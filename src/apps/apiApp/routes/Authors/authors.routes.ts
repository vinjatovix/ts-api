import { NextFunction, Request, Response, Router } from 'express';

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
import {
  DeleteAuthorController,
  GetAllAuthorsController,
  GetAuthorController,
  PatchAuthorController,
  PostAuthorController
} from '../../controllers/Authors';

const prefix = API_PREFIXES.author;

export const register = (router: Router) => {
  const postController: PostAuthorController = container.get(
    'Apps.apiApp.controllers.Authors.PostAuthorController'
  );

  const getController: GetAuthorController = container.get(
    'Apps.apiApp.controllers.Authors.GetAuthorController'
  );

  const getAllController: GetAllAuthorsController = container.get(
    'Apps.apiApp.controllers.Authors.GetAllAuthorsController'
  );

  const patchController: PatchAuthorController = container.get(
    'Apps.apiApp.controllers.Authors.PatchAuthorController'
  );

  const deleteController: DeleteAuthorController = container.get(
    'Apps.apiApp.controllers.Authors.DeleteAuthorController'
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
