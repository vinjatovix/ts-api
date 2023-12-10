import { NextFunction, Request, Response, Router } from 'express';
import { body, checkExact, param } from 'express-validator';
import container from '../../dependency-injection';
import { PostBookController } from '../../controllers/Books/PostBookController';
import { validateReqSchema } from '../shared';
import { GetBookController } from '../../controllers/Books/GetBookController';
import { DeleteBookController } from '../../controllers/Books/DeleteBookController';
import { GetAllBooksController } from '../../controllers/Books/GetAllBooksController';
import { PutBookController } from '../../controllers/Books/PutBookController';

const prefix = '/api/v1/Books';

export const register = (router: Router) => {
  const isbnRegex = /^(978|979)-\d{1,5}-\d{1,7}-\d{1,7}-\d$/;

  const postReqSchema = [
    body('id').exists().isUUID(),
    body('title').exists().isString(),
    body('author').exists().isString(),
    body('isbn').exists().matches(isbnRegex),
    body('releaseDate').exists().isISO8601().toDate(),
    body('pages').exists().isInt(),
    checkExact()
  ];

  const putReqSchema = [
    param('id').exists().isUUID(),
    body('id').exists().isUUID(),
    body('title').exists().isString(),
    body('author').exists().isString(),
    body('isbn').exists().matches(isbnRegex),
    body('releaseDate').exists().isISO8601().toDate(),
    body('pages').exists().isInt(),
    checkExact()
  ];

  const getReqSchema = [param('id').exists().isUUID(), checkExact()];
  const deleteReqSchema = [param('id').exists().isUUID(), checkExact()];

  const postController: PostBookController = container.get(
    'Apps.apiApp.controllers.Books.PostBookController'
  );

  const getController: GetBookController = container.get(
    'Apps.apiApp.controllers.Books.GetBookController'
  );

  const getAllController: GetAllBooksController = container.get(
    'Apps.apiApp.controllers.Books.GetAllBooksController'
  );

  const putController: PutBookController = container.get(
    'Apps.apiApp.controllers.Books.PutBookController'
  );

  const deleteController: DeleteBookController = container.get(
    'Apps.apiApp.controllers.Books.DeleteBookController'
  );

  router.post(
    `${prefix}/`,
    postReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      postController.run(req, res, next);
    }
  );

  router.put(
    `${prefix}/:id`,
    putReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      putController.run(req, res, next);
    }
  );

  router.get(`${prefix}`, (req: Request, res: Response, next: NextFunction) => {
    getAllController.run(req, res, next);
  });

  router.get(
    `${prefix}/:id`,
    getReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      getController.run(req, res, next);
    }
  );

  router.delete(
    `${prefix}/:id`,
    deleteReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      deleteController.run(req, res, next);
    }
  );
};
