import { AuthorPatcher } from '../../../../Contexts/apiApp/Authors/application';
import { AuthorCreatorRequest } from '../../../../Contexts/apiApp/Authors/application/interfaces';
import { createPatchController } from '../shared/controllerFactoryFunctions';

export const createPatchAuthorController = (service: AuthorPatcher) =>
  createPatchController<AuthorPatcher, AuthorCreatorRequest>(service);
