import { NextFunction, Request, Response, Router } from 'express';
import { API_PREFIXES } from '../shared';
import { PostCharacterBuildingController } from '../../controllers/CharacterBuildings';
import { auth, validateBody, validateReqSchema } from '../shared/middlewares';
import container from '../../dependency-injection';
import { postReqSchema } from './reqSchemas';

const prefix = API_PREFIXES.characterBuilding;

export const register = (router: Router) => {
  const postController = container.get(
    PostCharacterBuildingController.containerId
  );

  router.post(
    `${prefix}/`,
    auth,
    validateBody,
    postReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      postController.run(req, res, next);
    }
  );
};
