import { NextFunction, Request, Response, Router } from 'express';
import container from '../../dependency-injection';
import {
  auth,
  isAdmin,
  validateBody,
  validateReqSchema,
  includeAndFilter
} from '../shared/middlewares/';
import { API_PREFIXES } from '../shared';
import { postReqSchema, patchReqSchema, deleteReqSchema } from './reqSchemas';
import { GetAllController } from '../../controllers/shared/GetAllController';
import { RequestOptions } from '../../shared/interfaces';
import { CharacterPrimitives } from '../../../../Contexts/apiApp/Characters/domain/interfaces';
import {
  AllCharactersFinder,
  CharacterCreator,
  CharacterFinder,
  CharacterPatcher,
  CharacterRemover
} from '../../../../Contexts/apiApp/Characters/application';
import { GetController } from '../../controllers/shared/GetController';
import { PostController } from '../../controllers/shared/PostController';
import {
  CharacterCreatorRequest,
  CharacterPatcherRequest
} from '../../../../Contexts/apiApp/Characters/application/interfaces';
import { DeleteController } from '../../controllers/shared/DeleteController';
import { PatchController } from '../../controllers/shared/PatchController';

const prefix = API_PREFIXES.character;

export const register = (router: Router) => {
  const postController: PostController<
    CharacterCreator,
    CharacterCreatorRequest
  > = container.get(
    'Apps.apiApp.controllers.Characters.PostCharacterController'
  );

  const getAllController: GetAllController<
    AllCharactersFinder,
    Partial<RequestOptions>,
    CharacterPrimitives[]
  > = container.get(
    'Apps.apiApp.controllers.Characters.GetAllCharactersController'
  );

  const getController: GetController<
    CharacterFinder,
    Partial<RequestOptions>,
    CharacterPrimitives
  > = container.get(
    'Apps.apiApp.controllers.Characters.GetCharacterController'
  );

  const patchController: PatchController<
    CharacterPatcher,
    CharacterPatcherRequest
  > = container.get(
    'Apps.apiApp.controllers.Characters.PatchCharacterController'
  );

  const deleteController: DeleteController<CharacterRemover> = container.get(
    'Apps.apiApp.controllers.Characters.DeleteCharacterController'
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
    deleteReqSchema,
    validateReqSchema,
    (req: Request, res: Response, next: NextFunction) => {
      deleteController.run(req, res, next);
    }
  );
};
