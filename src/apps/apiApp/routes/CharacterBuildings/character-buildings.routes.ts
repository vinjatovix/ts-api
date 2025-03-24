import { NextFunction, Request, Response, Router } from 'express';
import { API_PREFIXES } from '../shared';
import {
  auth,
  includeAndFilter,
  validateBody,
  validateReqSchema
} from '../shared/middlewares';
import container from '../../dependency-injection';
import { patchReqSchema, postReqSchema } from './reqSchemas';
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
import { PatchController } from '../../controllers/shared/PatchController';
import { CharacterBuildingPatcher } from '../../../../Contexts/apiApp/CharacterBuildings/application/CharacterBuildingPatcher';
import { CharacterBuildingPatcherRequest } from '../../../../Contexts/apiApp/CharacterBuildings/application/interfaces/CharacterBuildingPatcherRequest';

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

  const patchController: PatchController<
    CharacterBuildingPatcher,
    CharacterBuildingPatcherRequest
  > = container.get(
    'Apps.apiApp.controllers.CharacterBuildings.PatchCharacterBuildingController'
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

  router.patch(
    `${prefix}/:id`,
    auth,
    validateBody,
    validateReqSchema,
    patchReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      patchController.run(req, res, next);
    }
  );
};
