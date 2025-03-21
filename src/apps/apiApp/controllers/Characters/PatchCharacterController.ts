import { CharacterPatcher } from '../../../../Contexts/apiApp/Characters/application';
import { CharacterPatcherRequest } from '../../../../Contexts/apiApp/Characters/application/interfaces';
import { createPatchController } from '../shared/controllerFactoryFunctions';

export const createPatchCharacterController = (service: CharacterPatcher) =>
  createPatchController<CharacterPatcher, CharacterPatcherRequest>(service);
