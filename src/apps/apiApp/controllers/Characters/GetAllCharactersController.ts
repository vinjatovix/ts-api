import { AllCharactersFinder } from '../../../../Contexts/apiApp/Characters/application';
import { CharacterPrimitives } from '../../../../Contexts/apiApp/Characters/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { createGetAllController } from '../shared/controllerFactoryFunctions';

export const createGetAllCharactersController = (
  service: AllCharactersFinder
) =>
  createGetAllController<
    AllCharactersFinder,
    Partial<RequestOptions>,
    Partial<CharacterPrimitives>[]
  >(service);
