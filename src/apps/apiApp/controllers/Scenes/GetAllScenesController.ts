import { AllScenesFinder } from '../../../../Contexts/apiApp/Scenes/application';
import { ScenePrimitives } from '../../../../Contexts/apiApp/Scenes/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { createGetAllController } from '../shared/controllerFactoryFunctions';

export const createGetAllScenesController = (service: AllScenesFinder) =>
  createGetAllController<
    AllScenesFinder,
    Partial<RequestOptions>,
    Partial<ScenePrimitives>[]
  >(service);
