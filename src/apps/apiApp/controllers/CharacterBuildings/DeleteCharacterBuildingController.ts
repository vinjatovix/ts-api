import { CharacterBuildingRemover } from '../../../../Contexts/apiApp/CharacterBuildings/application/CharacterBuildingRemover';
import { createDeleteController } from '../shared/controllerFactoryFunctions';

export const createDeleteCharacterBuildingController = (
  service: CharacterBuildingRemover
) => createDeleteController<CharacterBuildingRemover>(service);
