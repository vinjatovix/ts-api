import { CharacterRemover } from '../../../../Contexts/apiApp/Characters/application';
import { createDeleteController } from '../shared/controllerFactoryFunctions';

export const createDeleteCharacterController = (service: CharacterRemover) =>
  createDeleteController<CharacterRemover>(service);
