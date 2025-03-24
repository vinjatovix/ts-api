import { NextFunction, Request, Response, Router } from 'express';
import { API_PREFIXES } from '../shared';
import {
  auth,
  includeAndFilter,
  validateBody,
  validateReqSchema
} from '../shared/middlewares';
import container from '../../dependency-injection';
import { postReqSchema } from './reqSchemas';
import { PostController } from '../../controllers/shared/PostController';
import { CharacterBuildingCreator } from '../../../../Contexts/apiApp/CharacterBuildings/application/CharacterBuildingCreator';
import { CharacterBuildingCreatorRequest } from '../../../../Contexts/apiApp/CharacterBuildings/application/interfaces';
import { GetAllController } from '../../controllers/shared/GetAllController';
import { AllCharacterBuildingsFinder } from '../../../../Contexts/apiApp/CharacterBuildings/application/AllCharacterBuildingsFinder';
import { RequestOptions } from '../../shared/interfaces';
import { CharacterBuildingPrimitives } from '../../../../Contexts/apiApp/CharacterBuildings/domain/interfaces';

const prefix = API_PREFIXES.characterBuilding;

export const register = (router: Router) => {
  const postController: PostController<
    CharacterBuildingCreator,
    CharacterBuildingCreatorRequest
  > = container.get(
    'Apps.apiApp.controllers.CharacterBuildings.PostCharacterBuildingController'
  );

  const getAllController: GetAllController<
    AllCharacterBuildingsFinder,
    Partial<RequestOptions>,
    CharacterBuildingPrimitives[]
  > = container.get(
    'Apps.apiApp.controllers.CharacterBuildings.GetAllCharacterBuildingsController'
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

  router.get(
    `${prefix}/`,
    auth,
    includeAndFilter,
    (req: Request, res: Response, next: NextFunction) => {
      getAllController.run(req, res, next);
    }
  );
};
