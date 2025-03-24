import { AllCharacterBuildingsFinder } from '../../../../Contexts/apiApp/CharacterBuildings/application/AllCharacterBuildingsFinder';
import { CharacterBuildingPrimitives } from '../../../../Contexts/apiApp/CharacterBuildings/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { createGetAllController } from '../shared/controllerFactoryFunctions';

export const createGetAllCharacterBuildingsController = (
  service: AllCharacterBuildingsFinder
) =>
  createGetAllController<
    AllCharacterBuildingsFinder,
    Partial<RequestOptions>,
    Partial<CharacterBuildingPrimitives>[]
  >(service);
