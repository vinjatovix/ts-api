import { AuthorRemover } from '../../../../Contexts/apiApp/Authors/application';
import { createDeleteController } from '../shared/controllerFactoryFunctions';

export const createDeleteAuthorController = (service: AuthorRemover) =>
  createDeleteController<AuthorRemover>(service);
