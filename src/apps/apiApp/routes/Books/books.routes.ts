import { Request, Response, Router } from 'express';
import { body, param } from 'express-validator';
import container from '../../dependency-injection';
import { PutBookController } from '../../controllers/Books/PutBookController';
import { validateReqSchema } from '../shared';

const prefix = '/api/v1/Books';

export const register = (router: Router) => {
  const reqSchema = [
    param('id').exists().isUUID(),
    body('title').exists().isString(),
    body('author').exists().isString(),
    body('isbn').exists().isString(),
    body('releaseDate').exists().isString(),
    body('pages').exists().isInt()
  ];

  const controller: PutBookController = container.get(
    'Apps.apiApp.controllers.Books.PutBookController'
  );

  router.put(
    `${prefix}/:id`,
    reqSchema,
    validateReqSchema,
    (req: Request, res: Response) => {
      controller.run(req, res);
    }
  );
};
