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
import { GetController } from '../../controllers/shared/GetController';
import { CharacterBuildingFinder } from '../../../../Contexts/apiApp/CharacterBuildings/application/CharacterBuildingFinder';
import { CharacterBuildingRemover } from '../../../../Contexts/apiApp/CharacterBuildings/application/CharacterBuildingRemover';
import { DeleteController } from '../../controllers/shared/DeleteController';

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
    RequestOptions,
    CharacterBuildingPrimitives[]
  > = container.get(
    'Apps.apiApp.controllers.CharacterBuildings.GetAllCharacterBuildingsController'
  );

  const getController: GetController<
    CharacterBuildingFinder,
    RequestOptions,
    CharacterBuildingPrimitives
  > = container.get(
    'Apps.apiApp.controllers.CharacterBuildings.GetCharacterBuildingController'
  );

  const deleteController: DeleteController<CharacterBuildingRemover> =
    container.get(
      'Apps.apiApp.controllers.CharacterBuildings.DeleteCharacterBuildingController'
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

  router.get(
    `${prefix}/:id`,
    auth,
    includeAndFilter,
    (req: Request, res: Response, next: NextFunction) => {
      getController.run(req, res, next);
    }
  );

  router.delete(
    `${prefix}/:id`,
    auth,
    (req: Request, res: Response, next: NextFunction) => {
      deleteController.run(req, res, next);
    }
  );
};
