import { CharacterBuildingPatcher } from '../../../../Contexts/apiApp/CharacterBuildings/application/CharacterBuildingPatcher';
import { createPatchController } from '../shared/controllerFactoryFunctions';
import { CharacterBuildingPatcherRequest } from '../../../../Contexts/apiApp/CharacterBuildings/application/interfaces/CharacterBuildingPatcherRequest';

export const createPatchCharacterBuildingController = (
  service: CharacterBuildingPatcher
) =>
  createPatchController<
    CharacterBuildingPatcher,
    CharacterBuildingPatcherRequest
  >(service);
