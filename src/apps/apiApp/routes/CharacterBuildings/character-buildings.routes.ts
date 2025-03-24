import { NextFunction, Request, Response, Router } from 'express';
import { API_PREFIXES } from '../shared';
import { auth, validateBody, validateReqSchema } from '../shared/middlewares';
import container from '../../dependency-injection';
import { postReqSchema } from './reqSchemas';
import { PostController } from '../../controllers/shared/PostController';
import { CharacterBuildingCreator } from '../../../../Contexts/apiApp/CharacterBuildings/application/CharacterBuildingCreator';
import { CharacterBuildingCreatorRequest } from '../../../../Contexts/apiApp/CharacterBuildings/application/interfaces';

const prefix = API_PREFIXES.characterBuilding;

export const register = (router: Router) => {
  const postController: PostController<
    CharacterBuildingCreator,
    CharacterBuildingCreatorRequest
  > = container.get(
    'Apps.apiApp.controllers.CharacterBuildings.PostCharacterBuildingController'
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
