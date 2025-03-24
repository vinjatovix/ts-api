import { CharacterFinder } from '../../../../Contexts/apiApp/Characters/application';
import { CharacterPrimitives } from '../../../../Contexts/apiApp/Characters/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { createGetController } from '../shared/controllerFactoryFunctions';

export const createGetCharacterController = (service: CharacterFinder) =>
  createGetController<
    CharacterFinder,
    Partial<RequestOptions>,
    Partial<CharacterPrimitives>
  >(service);
