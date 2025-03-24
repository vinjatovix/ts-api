import { AuthorFinder } from '../../../../Contexts/apiApp/Authors/application';
import { AuthorPrimitives } from '../../../../Contexts/apiApp/Authors/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { createGetController } from '../shared/controllerFactoryFunctions';

export const createGetAuthorController = (service: AuthorFinder) =>
  createGetController<
    AuthorFinder,
    Partial<RequestOptions>,
    Partial<AuthorPrimitives>
  >(service);
