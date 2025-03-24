import { AuthorCreator } from '../../../../Contexts/apiApp/Authors/application';
import { AuthorCreatorRequest } from '../../../../Contexts/apiApp/Authors/application/interfaces';
import { createPostController } from '../shared/controllerFactoryFunctions';

export const createPostAuthorController = (service: AuthorCreator) =>
  createPostController<AuthorCreator, AuthorCreatorRequest>(service);
