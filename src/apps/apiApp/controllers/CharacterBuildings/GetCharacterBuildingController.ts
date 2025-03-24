import { CharacterBuildingFinder } from '../../../../Contexts/apiApp/CharacterBuildings/application/CharacterBuildingFinder';
import { CharacterBuildingPrimitives } from '../../../../Contexts/apiApp/CharacterBuildings/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { createGetController } from '../shared/controllerFactoryFunctions';

export const createGetCharacterBuildingController = (
  service: CharacterBuildingFinder
) =>
  createGetController<
    CharacterBuildingFinder,
    Partial<RequestOptions>,
    Partial<CharacterBuildingPrimitives>
  >(service);
