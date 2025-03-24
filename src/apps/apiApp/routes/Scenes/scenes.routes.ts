import { NextFunction, Request, Response, Router } from 'express';
import { API_PREFIXES } from '../shared';
import container from '../../dependency-injection';
import {
  auth,
  includeAndFilter,
  isAdmin,
  validateBody,
  validateReqSchema
} from '../shared/middlewares';
import { patchReqSchema, postReqSchema } from './reqSchemas';
import { GetController } from '../../controllers/shared/GetController';
import {
  AllScenesFinder,
  SceneCreator,
  SceneFinder,
  ScenePatcher,
  SceneRemover
} from '../../../../Contexts/apiApp/Scenes/application';
import { ScenePrimitives } from '../../../../Contexts/apiApp/Scenes/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { GetAllController } from '../../controllers/shared/GetAllController';
import { PostController } from '../../controllers/shared/PostController';
import {
  SceneCreatorRequest,
  ScenePatcherRequest
} from '../../../../Contexts/apiApp/Scenes/application/interfaces';
import { DeleteController } from '../../controllers/shared/DeleteController';
import { PatchController } from '../../controllers/shared/PatchController';

const prefix = API_PREFIXES.scene;

export const register = (router: Router) => {
  const postController: PostController<SceneCreator, SceneCreatorRequest> =
    container.get('Apps.apiApp.controllers.Scenes.PostSceneController');

  const getAllController: GetAllController<
    AllScenesFinder,
    Partial<RequestOptions>,
    ScenePrimitives[]
  > = container.get('Apps.apiApp.controllers.Scenes.GetAllScenesController');

  const getController: GetController<
    SceneFinder,
    Partial<RequestOptions>,
    ScenePrimitives
  > = container.get('Apps.apiApp.controllers.Scenes.GetSceneController');

  const patchController: PatchController<ScenePatcher, ScenePatcherRequest> =
    container.get('Apps.apiApp.controllers.Scenes.PatchSceneController');
  const deleteController: DeleteController<SceneRemover> = container.get(
    'Apps.apiApp.controllers.Scenes.DeleteSceneController'
  );

  router.post(
    `${prefix}/`,
    auth,
    isAdmin,
    validateBody,
    postReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      postController.run(req, res, next);
    }
  );

  router.get(
    `${prefix}`,
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

  router.patch(
    `${prefix}/:id`,
    auth,
    isAdmin,
    validateBody,
    patchReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      patchController.run(req, res, next);
    }
  );

  router.delete(
    `${prefix}/:id`,
    auth,
    isAdmin,
    (req: Request, res: Response, next: NextFunction) => {
      deleteController.run(req, res, next);
    }
  );
};
