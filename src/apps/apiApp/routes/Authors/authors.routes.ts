import { NextFunction, Request, Response, Router } from 'express';
import container from '../../dependency-injection';
import { API_PREFIXES } from '../shared';
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
import { GetController } from '../../controllers/shared/GetController';
import {
  AllAuthorsFinder,
  AuthorCreator,
  AuthorFinder,
  AuthorPatcher,
  AuthorRemover
} from '../../../../Contexts/apiApp/Authors/application';
import { RequestOptions } from '../../shared/interfaces';
import { AuthorPrimitives } from '../../../../Contexts/apiApp/Authors/domain/interfaces';
import { GetAllController } from '../../controllers/shared/GetAllController';
import { PostController } from '../../controllers/shared/PostController';
import { AuthorCreatorRequest } from '../../../../Contexts/apiApp/Authors/application/interfaces';
import { DeleteController } from '../../controllers/shared/DeleteController';
import { PatchController } from '../../controllers/shared/PatchController';

const prefix = API_PREFIXES.author;

export const register = (router: Router) => {
  const postController: PostController<AuthorCreator, AuthorCreatorRequest> =
    container.get('Apps.apiApp.controllers.Authors.PostAuthorController');

  const getController: GetController<
    AuthorFinder,
    Partial<RequestOptions>,
    AuthorPrimitives
  > = container.get('Apps.apiApp.controllers.Authors.GetAuthorController');

  const getAllController: GetAllController<
    AllAuthorsFinder,
    Partial<RequestOptions>,
    AuthorPrimitives[]
  > = container.get('Apps.apiApp.controllers.Authors.GetAllAuthorsController');

  const patchController: PatchController<AuthorPatcher, AuthorCreatorRequest> =
    container.get('Apps.apiApp.controllers.Authors.PatchAuthorController');

  const deleteController: DeleteController<AuthorRemover> = container.get(
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
