import { SceneFinder } from '../../../../Contexts/apiApp/Scenes/application';
import { ScenePrimitives } from '../../../../Contexts/apiApp/Scenes/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { createGetController } from '../shared/controllerFactoryFunctions';

export const createGetSceneController = (service: SceneFinder) =>
  createGetController<
    SceneFinder,
    Partial<RequestOptions>,
    Partial<ScenePrimitives>
  >(service);
