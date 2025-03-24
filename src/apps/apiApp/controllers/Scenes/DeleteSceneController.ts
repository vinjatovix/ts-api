import { SceneRemover } from '../../../../Contexts/apiApp/Scenes/application';
import { createDeleteController } from '../shared/controllerFactoryFunctions';

export const createDeleteSceneController = (service: SceneRemover) =>
  createDeleteController<SceneRemover>(service);
