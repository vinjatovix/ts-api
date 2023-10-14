import { Request, Response, Router } from 'express';
import container from '../../dependency-injection';
import { PutBookController } from '../../controllers/Books/PutBookController';

const prefix = '/api/v1/Books';

export const register = (router: Router) => {
  const controller: PutBookController = container.get(
    'Apps.apiApp.controllers.Books.PutBookController'
  );
  router.put(`${prefix}/:id`, (req: Request, res: Response) => {
    controller.run(req, res);
  });
};
