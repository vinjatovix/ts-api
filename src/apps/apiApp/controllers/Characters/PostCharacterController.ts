import { CharacterCreator } from '../../../../Contexts/apiApp/Characters/application';
import { CharacterCreatorRequest } from '../../../../Contexts/apiApp/Characters/application/interfaces';
import { createPostController } from '../shared/controllerFactoryFunctions';

export const createPostCharacterController = (service: CharacterCreator) =>
  createPostController<CharacterCreator, CharacterCreatorRequest>(service);
