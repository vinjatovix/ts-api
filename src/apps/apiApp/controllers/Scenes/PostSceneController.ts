import { SceneCreator } from '../../../../Contexts/apiApp/Scenes/application';
import { SceneCreatorRequest } from '../../../../Contexts/apiApp/Scenes/application/interfaces';
import { createPostController } from '../shared/controllerFactoryFunctions';

export const createPostSceneController = (service: SceneCreator) =>
  createPostController<SceneCreator, SceneCreatorRequest>(service);
