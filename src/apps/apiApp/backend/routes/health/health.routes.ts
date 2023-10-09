import { Request, Response, Router } from 'express';
import { GetStatusController } from '../../controllers/health/GetStatusController';
import container from '../../dependency-injection';

const prefix = '/api/v1/health';

export const register = (router: Router) => {
  const controller: GetStatusController = container.get(
    'Apps.apiApp.controllers.health.GetStatusController'
  );
  router.get(`${prefix}/http`, (req: Request, res: Response) => {
    controller.run(req, res);
  });
};
