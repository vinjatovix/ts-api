import { ScenePatcher } from '../../../../Contexts/apiApp/Scenes/application';
import { ScenePatcherRequest } from '../../../../Contexts/apiApp/Scenes/application/interfaces';
import { createPatchController } from '../shared/controllerFactoryFunctions';

export const createPatchSceneController = (service: ScenePatcher) =>
  createPatchController<ScenePatcher, ScenePatcherRequest>(service);
