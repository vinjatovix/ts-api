import { NextFunction, Request, Response, Router } from 'express';
import { body, checkExact, param } from 'express-validator';
import container from '../../dependency-injection';
import { PutBookController } from '../../controllers/Books/PutBookController';
import { validateReqSchema } from '../shared';
import { GetBookController } from '../../controllers/Books/GetBookController';

const prefix = '/api/v1/Books';

export const register = (router: Router) => {
  const createReqSchema = [
    param('id').exists().isUUID(),
    body('title').exists().isString(),
    body('author').exists().isString(),
    body('isbn')
      .exists()
      .matches(/^(978|979)-\d{1,5}-\d{1,7}-\d{1,7}-\d$/),
    body('releaseDate')
      .exists()
      .matches(
        /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z|(\d{2}-(0[1-9]|1[0-2])-\d{4})|(\d{4}-\d{2}-\d{2}))$/
      ),
    body('pages').exists().isInt(),
    checkExact()
  ];

  const getReqSchema = [param('id').exists().isUUID(), checkExact()];

  const putController: PutBookController = container.get(
    'Apps.apiApp.controllers.Books.PutBookController'
  );

  const getController: GetBookController = container.get(
    'Apps.apiApp.controllers.Books.GetBookController'
  );

  router.put(
    `${prefix}/:id`,
    createReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      putController.run(req, res, next);
    }
  );

  router.get(
    `${prefix}/:id`,
    getReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      getController.run(req, res, next);
    }
  );
};
