import { AllAuthorsFinder } from '../../../../Contexts/apiApp/Authors/application';
import { AuthorPrimitives } from '../../../../Contexts/apiApp/Authors/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { createGetAllController } from '../shared/controllerFactoryFunctions';

export const createGetAllAuthorsController = (service: AllAuthorsFinder) =>
  createGetAllController<
    AllAuthorsFinder,
    Partial<RequestOptions>,
    Partial<AuthorPrimitives>[]
  >(service);
