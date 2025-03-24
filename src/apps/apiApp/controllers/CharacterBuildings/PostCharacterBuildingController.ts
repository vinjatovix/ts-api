import { CharacterBuildingCreator } from '../../../../Contexts/apiApp/CharacterBuildings/application/CharacterBuildingCreator';
import { CharacterBuildingCreatorRequest } from '../../../../Contexts/apiApp/CharacterBuildings/application/interfaces';
import { createPostController } from '../shared/controllerFactoryFunctions';

export const createPostCharacterBuildingController = (
  service: CharacterBuildingCreator
) =>
  createPostController<
    CharacterBuildingCreator,
    CharacterBuildingCreatorRequest
  >(service);
