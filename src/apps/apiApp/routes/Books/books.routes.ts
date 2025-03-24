import { NextFunction, Request, Response, Router } from 'express';
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
import { GetController } from '../../controllers/shared/GetController';
import {
  AllBooksFinder,
  BookCreator,
  BookFinder,
  BookPatcher,
  BookRemover
} from '../../../../Contexts/apiApp/Books/application';
import { BookPrimitives } from '../../../../Contexts/apiApp/Books/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { GetAllController } from '../../controllers/shared/GetAllController';
import { BookCreatorRequest } from '../../../../Contexts/apiApp/Books/application/interfaces';
import { PostController } from '../../controllers/shared/PostController';
import { DeleteController } from '../../controllers/shared/DeleteController';
import { PatchController } from '../../controllers/shared/PatchController';

const prefix = API_PREFIXES.book;
export const register = (router: Router) => {
  const postController: PostController<BookCreator, BookCreatorRequest> =
    container.get('Apps.apiApp.controllers.Books.PostBookController');

  const getController: GetController<
    BookFinder,
    Partial<RequestOptions>,
    BookPrimitives
  > = container.get('Apps.apiApp.controllers.Books.GetBookController');

  const getAllController: GetAllController<
    AllBooksFinder,
    Partial<RequestOptions>,
    BookPrimitives[]
  > = container.get('Apps.apiApp.controllers.Books.GetAllBooksController');

  const patchController: PatchController<BookPatcher, BookCreatorRequest> =
    container.get('Apps.apiApp.controllers.Books.PatchBookController');

  const deleteController: DeleteController<BookRemover> = container.get(
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
