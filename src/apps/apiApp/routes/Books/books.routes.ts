import { Request, Response, Router } from 'express';
import { body, checkExact, param } from 'express-validator';
import container from '../../dependency-injection';
import { PutBookController } from '../../controllers/Books/PutBookController';
import { validateReqSchema } from '../shared';

const prefix = '/api/v1/Books';

export const register = (router: Router) => {
  const reqSchema = [
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
